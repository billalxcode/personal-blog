import { Token } from "./types";

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  let line = 1;
  let col = 1;

  function advance(n = 1) {
    for (let i = 0; i < n; i++) {
      if (index >= source.length) break;
      const char = source[index];
      if (char === "\n") {
        line++;
        col = 1;
      } else {
        col++;
      }
      index++;
    }
  }

  function peek(n = 0) {
    if (index + n >= source.length) return "";
    return source[index + n];
  }

  while (index < source.length) {
    const char = peek();

    // 1. Comments
    if (char === "%") {
      while (index < source.length && peek() !== "\n") {
        advance();
      }
      continue;
    }

    // 2. Math display \[...\]
    if (char === "\\" && peek(1) === "[") {
      const startLine = line;
      const startCol = col;
      advance(2); // consume \[
      let math = "";
      while (index < source.length && !(peek() === "\\" && peek(1) === "]")) {
        math += peek();
        advance();
      }
      if (index < source.length) {
        advance(2); // consume \]
      }
      tokens.push({
        type: "MATH_DISPLAY",
        value: math.trim(),
        line: startLine,
        col: startCol,
      });
      continue;
    }

    // 3. Linebreak \\
    if (char === "\\" && peek(1) === "\\") {
      tokens.push({ type: "LINEBREAK", value: "\\\\", line, col });
      advance(2);
      continue;
    }

    // 4. Escaped characters: \&, \$, \%, \_, \#, \{, \}
    if (
      char === "\\" &&
      ["&", "$", "%", "_", "#", "{", "}"].includes(peek(1))
    ) {
      const escapedChar = peek(1);
      tokens.push({ type: "TEXT", value: escapedChar, line, col });
      advance(2);
      continue;
    }

    // 5. Environments: \begin{env} and \end{env}
    if (char === "\\" && source.substring(index, index + 7) === "\\begin{") {
      const startLine = line;
      const startCol = col;
      let nameIndex = index + 7;
      let name = "";
      while (nameIndex < source.length && source[nameIndex] !== "}") {
        name += source[nameIndex];
        nameIndex++;
      }
      if (nameIndex < source.length && source[nameIndex] === "}") {
        tokens.push({
          type: "ENVIRONMENT_BEGIN",
          value: name,
          line: startLine,
          col: startCol,
        });
        advance(7 + name.length + 1);
        continue;
      }
    }
    if (char === "\\" && source.substring(index, index + 5) === "\\end{") {
      const startLine = line;
      const startCol = col;
      let nameIndex = index + 5;
      let name = "";
      while (nameIndex < source.length && source[nameIndex] !== "}") {
        name += source[nameIndex];
        nameIndex++;
      }
      if (nameIndex < source.length && source[nameIndex] === "}") {
        tokens.push({
          type: "ENVIRONMENT_END",
          value: name,
          line: startLine,
          col: startCol,
        });
        advance(5 + name.length + 1);
        continue;
      }
    }

    // 6. General commands \command
    if (char === "\\") {
      const startLine = line;
      const startCol = col;
      advance(); // consume \
      let name = "";
      while (index < source.length && /[a-zA-Z]/.test(peek())) {
        name += peek();
        advance();
      }
      // Check for optional trailing *
      if (peek() === "*") {
        name += "*";
        advance();
      }
      if (name.length > 0) {
        tokens.push({
          type: "COMMAND",
          value: name,
          line: startLine,
          col: startCol,
        });
      } else {
        const next = peek();
        if (next) {
          tokens.push({
            type: "COMMAND",
            value: next,
            line: startLine,
            col: startCol,
          });
          advance();
        } else {
          tokens.push({
            type: "TEXT",
            value: "\\",
            line: startLine,
            col: startCol,
          });
        }
      }
      continue;
    }

    // 7. Math Display $$...$$
    if (char === "$" && peek(1) === "$") {
      const startLine = line;
      const startCol = col;
      advance(2); // consume $$
      let math = "";
      while (index < source.length && !(peek() === "$" && peek(1) === "$")) {
        math += peek();
        advance();
      }
      if (index < source.length) {
        advance(2); // consume $$
      }
      tokens.push({
        type: "MATH_DISPLAY",
        value: math.trim(),
        line: startLine,
        col: startCol,
      });
      continue;
    }

    // 8. Math Inline $...$
    if (char === "$") {
      const startLine = line;
      const startCol = col;
      advance(); // consume $
      let math = "";
      while (index < source.length && peek() !== "$") {
        math += peek();
        advance();
      }
      if (index < source.length) {
        advance(); // consume closing $
      }
      tokens.push({
        type: "MATH_INLINE",
        value: math.trim(),
        line: startLine,
        col: startCol,
      });
      continue;
    }

    // 9. Single Character Tokens
    if (char === "{") {
      tokens.push({ type: "BRACE_OPEN", value: "{", line, col });
      advance();
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "BRACE_CLOSE", value: "}", line, col });
      advance();
      continue;
    }
    if (char === "[") {
      tokens.push({ type: "BRACKET_OPEN", value: "[", line, col });
      advance();
      continue;
    }
    if (char === "]") {
      tokens.push({ type: "BRACKET_CLOSE", value: "]", line, col });
      advance();
      continue;
    }
    if (char === "&") {
      tokens.push({ type: "AMPERSAND", value: "&", line, col });
      advance();
      continue;
    }
    if (char === "~") {
      tokens.push({ type: "TEXT", value: " ", line, col });
      advance();
      continue;
    }

    // 10. Double newlines (paragraph break)
    if (char === "\n") {
      const startLine = line;
      const startCol = col;
      advance();
      let newlineCount = 1;
      while (index < source.length && /\s/.test(peek())) {
        if (peek() === "\n") {
          newlineCount++;
        }
        advance();
      }
      if (newlineCount >= 2) {
        tokens.push({
          type: "NEWLINE",
          value: "\n\n",
          line: startLine,
          col: startCol,
        });
      } else {
        tokens.push({
          type: "TEXT",
          value: " ",
          line: startLine,
          col: startCol,
        });
      }
      continue;
    }

    // 11. Whitespace
    if (/\s/.test(char)) {
      const startLine = line;
      const startCol = col;
      while (index < source.length && /\s/.test(peek()) && peek() !== "\n") {
        advance();
      }
      tokens.push({ type: "TEXT", value: " ", line: startLine, col: startCol });
      continue;
    }

    // 12. Accumulate other characters as text
    const startLine = line;
    const startCol = col;
    let text = "";
    while (
      index < source.length &&
      ![
        "%",
        "\\",
        "$",
        "{",
        "}",
        "[",
        "]",
        "&",
        "~",
        "\n",
        "\r",
        " ",
        "\t",
      ].includes(peek())
    ) {
      text += peek();
      advance();
    }
    if (text.length > 0) {
      tokens.push({
        type: "TEXT",
        value: text,
        line: startLine,
        col: startCol,
      });
    }
  }

  // Merge consecutive TEXT tokens
  const mergedTokens: Token[] = [];
  for (const token of tokens) {
    if (token.type === "TEXT") {
      const last = mergedTokens[mergedTokens.length - 1];
      if (last && last.type === "TEXT") {
        if (last.value === " " && token.value === " ") {
          continue;
        }
        last.value += token.value;
      } else {
        mergedTokens.push(token);
      }
    } else {
      mergedTokens.push(token);
    }
  }

  return mergedTokens;
}

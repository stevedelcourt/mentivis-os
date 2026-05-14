export function htmlToMarkdown(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  let result = "";

  function process(nodes: NodeList): string {
    let out = "";
    for (const node of Array.from(nodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        out += node.textContent || "";
        continue;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const inner = process(el.childNodes);

      switch (tag) {
        case "h1": out += `# ${inner}\n\n`; break;
        case "h2": out += `## ${inner}\n\n`; break;
        case "h3": out += `### ${inner}\n\n`; break;
        case "h4": out += `#### ${inner}\n\n`; break;
        case "h5": out += `##### ${inner}\n\n`; break;
        case "h6": out += `###### ${inner}\n\n`; break;
        case "p": out += `${inner}\n\n`; break;
        case "br": out += "\n"; break;
        case "hr": out += "---\n\n"; break;
        case "ul": out += `${inner}\n`; break;
        case "ol": out += `${inner}\n`; break;
        case "li": out += `- ${inner.trim()}\n`; break;
        case "strong": case "b": out += `**${inner}**`; break;
        case "em": case "i": out += `*${inner}*`; break;
        case "u": out += `${inner}`; break;
        case "a": {
          const href = el.getAttribute("href") || "";
          out += href ? `[${inner}](${href})` : inner;
          break;
        }
        case "code": out += `\`${inner}\``; break;
        case "pre": out += "```\n" + inner + "\n```\n\n"; break;
        case "blockquote": out += `> ${inner}\n\n`; break;
        case "div": case "span": out += inner; break;
        case "img": {
          const src = el.getAttribute("src") || "";
          const alt = el.getAttribute("alt") || "";
          out += src ? `![${alt}](${src})` : "";
          break;
        }
        default: out += inner; break;
      }
    }
    return out;
  }

  result = process(doc.body.childNodes);

  return result.replace(/\n{4,}/g, "\n\n").trim();
}

export function looksLikeHtml(text: string): boolean {
  return /<[a-z][\s\S]*?>/i.test(text) && !/^(\s*[#\-\*•\w])/.test(text);
}

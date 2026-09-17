/** Añade un botón de copiar a cada bloque de código marcado con data-copy. */
export function initCopyCode(root = document) {
  const blocks = root.querySelectorAll('.code-sample[data-copy]');

  blocks.forEach((block) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button';
    button.textContent = 'Copiar';

    button.addEventListener('click', async () => {
      const code = block.querySelector('code')?.textContent ?? '';
      try {
        await navigator.clipboard.writeText(code);
        button.textContent = 'Copiado';
      } catch {
        // Sin permiso de portapapeles queda la selección manual, que siempre funciona.
        button.textContent = 'Selecciona y copia';
      }
      setTimeout(() => {
        button.textContent = 'Copiar';
      }, 2000);
    });

    block.appendChild(button);
  });
}

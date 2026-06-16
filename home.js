document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.collage-container');
    const items = document.querySelectorAll('.collage-item');

    items.forEach(item => {
        let isDragging = false;
        let startX, startY;
        let initialLeft, initialTop;

        // Executado quando o usuário clica ou toca no item
        item.addEventListener('pointerdown', (e) => {
            // Olho clínico de Sênior: Se a tela for menor que 768px, o seu CSS muda 
            // os itens para 'position: static'. Arrastar elementos estáticos quebra o layout.
            if (window.innerWidth <= 768) return;

            isDragging = true;
            
            // Captura o ponteiro para que o movimento não se perca se o usuário mover rápido demais
            item.setPointerCapture(e.pointerId);

            // 1. Remove temporariamente a transição CSS para o arrasto não ficar "atrasado"
            item.style.transition = 'none';
            
            // 2. Traz o item atual totalmente para a frente da pilha de colagens
            item.style.zIndex = '1000';

            // 3. Descobre a posição atual do item em pixels exatos na tela
            const rect = item.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            
            initialLeft = rect.left - containerRect.left;
            initialTop = rect.top - containerRect.top;

            // 4. Correção crucial: Força o uso de top/left em pixels e anula right/bottom do CSS
            item.style.left = `${initialLeft}px`;
            item.style.top = `${initialTop}px`;
            item.style.right = 'auto';
            item.style.bottom = 'auto';

            // Guarda onde o clique começou
            startX = e.clientX;
            startY = e.clientY;
        });

        // Executado enquanto o usuário move o mouse/dedo
        item.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            // Calcula o quanto o cursor se moveu desde o clique inicial
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            // Define a nova posição baseada na posição inicial + o movimento
            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // Atualiza o elemento no DOM em tempo real
            item.style.left = `${newLeft}px`;
            item.style.top = `${newTop}px`;
        });

        // Executado quando o usuário solta o clique/dedo
        item.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            // Libera o ponteiro
            item.releasePointerCapture(e.pointerId);

            // Devolve o controle da transição para o CSS (assim o efeito de :hover volta a funcionar)
            item.style.transition = '';
            
            // Mantém o item levemente acima dos outros que não foram mexidos (memória de empilhamento)
            item.style.zIndex = '99'; 
        });
    });
});
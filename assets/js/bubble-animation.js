/**
 * 泡泡动画效果脚本
 * 为标签/专栏泡泡添加不规则排布和微妙的悬浮动画
 */

document.addEventListener('DOMContentLoaded', function() {
    const bubbleContainer = document.getElementById('bubbleContainer');
    
    if (!bubbleContainer) return;
    
    const bubbles = bubbleContainer.querySelectorAll('.bubble-item');
    
    if (bubbles.length === 0) return;
    
    // 为每个泡泡设置随机的动画延迟和浮动方向
    bubbles.forEach((bubble, index) => {
        // 随机动画延迟 (0-2秒)
        const delay = (Math.random() * 2).toFixed(2);
        bubble.style.setProperty('--animation-delay', `${delay}s`);
        
        // 随机浮动方向 (-5px到5px)
        const floatX = (Math.random() * 10 - 5).toFixed(1);
        bubble.style.setProperty('--float-x', `${floatX}px`);
        
        // 添加悬停时的额外效果
        bubble.addEventListener('mouseenter', function() {
            bubble.style.zIndex = 100;
        });
        
        bubble.addEventListener('mouseleave', function() {
            bubble.style.zIndex = 'auto';
        });
    });
    
    // 实现更复杂的不规则排布逻辑
    layoutBubbles(bubbles, bubbleContainer);
});

/**
 * 计算泡泡的不规则排布
 * @param {NodeList} bubbles - 所有泡泡元素
 * @param {HTMLElement} container - 容器元素
 */
function layoutBubbles(bubbles, container) {
    const containerRect = container.getBoundingClientRect();
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // 粒子物理模拟参数
    const positions = [];
    const velocities = [];
    
    bubbles.forEach((bubble, index) => {
        const size = bubble.offsetWidth;
        
        // 初始化随机位置（在容器内）
        let x = Math.random() * (containerWidth - size);
        let y = Math.random() * (containerHeight * 0.6); // 主要在上半部分
        
        // 检查碰撞并调整位置
        let colliding = true;
        let attempts = 0;
        while (colliding && attempts < 10) {
            colliding = false;
            for (let i = 0; i < positions.length; i++) {
                const dx = positions[i].x - x;
                const dy = positions[i].y - y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = size + positions[i].size + 20;
                
                if (distance < minDistance) {
                    // 调整位置避免碰撞
                    x = Math.random() * (containerWidth - size);
                    y = Math.random() * (containerHeight * 0.6);
                    colliding = true;
                    attempts++;
                    break;
                }
            }
        }
        
        positions.push({ x, y, size });
        velocities.push({ x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 });
        
        // 应用初始位置（但保留CSS动画）
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 20;
        
        bubble.style.setProperty('--bubble-x', `${offsetX}px`);
        bubble.style.setProperty('--bubble-y', `${offsetY}px`);
    });
    
    // 可选：添加缓慢的重力效果（向下飘）
    animateFloat(bubbles, container);
}

/**
 * 连续的浮动动画
 * @param {NodeList} bubbles - 所有泡泡元素
 * @param {HTMLElement} container - 容器元素
 */
function animateFloat(bubbles, container) {
    let time = 0;
    
    const animate = () => {
        time += 0.016; // 约60fps
        
        bubbles.forEach((bubble, index) => {
            // 使用正弦波创建平滑的浮动
            const floatOffset = Math.sin(time * 0.5 + index) * 3;
            const sideOffset = Math.cos(time * 0.3 + index * 0.5) * 2;
            
            // 不影响CSS主要动画，只做微调
            bubble.style.setProperty('--micro-float-y', `${floatOffset}px`);
            bubble.style.setProperty('--micro-float-x', `${sideOffset}px`);
        });
        
        requestAnimationFrame(animate);
    };
    
    animate();
}

/**
 * 响应容器大小变化
 */
if (typeof ResizeObserver !== 'undefined') {
    const bubbleContainer = document.getElementById('bubbleContainer');
    if (bubbleContainer) {
        const resizeObserver = new ResizeObserver(() => {
            // 重新计算布局
            const bubbles = bubbleContainer.querySelectorAll('.bubble-item');
            if (bubbles.length > 0) {
                layoutBubbles(bubbles, bubbleContainer);
            }
        });
        
        resizeObserver.observe(bubbleContainer);
    }
}

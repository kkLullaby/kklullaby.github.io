/**
 * 泡泡动画效果脚本
 * 为标签/专栏泡泡添加真实的不规则布朗运动效果
 */

document.addEventListener('DOMContentLoaded', function() {
    const bubbleContainer = document.getElementById('bubbleContainer');
    if (!bubbleContainer) return;
    
    const bubbles = bubbleContainer.querySelectorAll('.bubble-item');
    if (bubbles.length === 0) return;
    
    // 初始化每个泡泡的物理参数
    bubbles.forEach((bubble) => {
        // 初始化不规则运动参数
        // 我们使用多个正弦波叠加来模拟随机运动
        // x = A*sin(at+p1) + B*cos(bt+p2)
        // y = C*sin(ct+p3) + D*cos(dt+p4)
        
        bubble.physics = {
            // 振幅 (运动范围，像素) - 增加范围让运动更明显
            ampX1: Math.random() * 20 + 10,
            ampX2: Math.random() * 10 + 5,
            ampY1: Math.random() * 25 + 10,  // 垂直方向稍大一点
            ampY2: Math.random() * 15 + 5,
            
            // 频率 (运动速度) - 稍微提高一点速度
            freqX1: Math.random() * 0.001 + 0.0005,
            freqX2: Math.random() * 0.002 + 0.001,
            freqY1: Math.random() * 0.001 + 0.0005,
            freqY2: Math.random() * 0.002 + 0.001,
            
            // 相位 (起始位置)
            phaseX1: Math.random() * Math.PI * 2,
            phaseX2: Math.random() * Math.PI * 2,
            phaseY1: Math.random() * Math.PI * 2,
            phaseY2: Math.random() * Math.PI * 2,
            
            // 悬停状态
            isHovering: false,
            // 悬停缩放比例
            scale: 1,
            // 基础z-index
            baseZIndex: 1
        };
        
        // 绑定事件
        bubble.addEventListener('mouseenter', () => {
            bubble.physics.isHovering = true;
            bubble.physics.scale = 1.15; // 放大
            bubble.style.zIndex = 100;
        });
        
        bubble.addEventListener('mouseleave', () => {
            bubble.physics.isHovering = false;
            bubble.physics.scale = 1; // 恢复
            // 延迟恢复z-index，避免闪烁
            setTimeout(() => {
                if (!bubble.physics.isHovering) {
                   bubble.style.zIndex = bubble.physics.baseZIndex;
                }
            }, 300);
        });
    });
    
    // 启动动画循环
    startAnimationLoop(bubbles);
});

/**
 * 启动动画循环
 * @param {NodeList} bubbles 
 */
function startAnimationLoop(bubbles) {
    function animate(timestamp) {
        // 使用时间作为输入，生成平滑的噪声
        const t = timestamp;
        
        bubbles.forEach(bubble => {
            const p = bubble.physics;
            
            // 计算偏移量
            // 如果悬停，我们减缓时间流逝的影响，或者减小振幅，这里简单处理为继续运动但叠加位置
            
            const offsetX = 
                p.ampX1 * Math.sin(t * p.freqX1 + p.phaseX1) + 
                p.ampX2 * Math.cos(t * p.freqX2 + p.phaseX2);
                
            const offsetY = 
                p.ampY1 * Math.sin(t * p.freqY1 + p.phaseY1) + 
                p.ampY2 * Math.cos(t * p.freqY2 + p.phaseY2);
            
            // 悬停时的额外位移 (模拟上升浮力)
            const hoverLift = p.isHovering ? -15 : 0;
            
            // 应用变换
            // translate3d 开启硬件加速
            // scale 缩放
            // 旋转一点点增加真实感 (基于x轴运动)
            const rotate = offsetX * 0.2; 
            
            bubble.style.transform = 
                `translate3d(${offsetX.toFixed(2)}px, ${(offsetY + hoverLift).toFixed(2)}px, 0) scale(${p.scale}) rotate(${rotate.toFixed(2)}deg)`;
        });
        
        requestAnimationFrame(animate);
    }
    
    requestAnimationFrame(animate);
}

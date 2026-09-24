/**
 * أنيميشن طيران عنصر من الزر إلى أيقونة السلة في الـ Navbar
 * - يبحث عن عنصر بـ id="cart-icon-target"
 * - إذا لم يجدها، يستخدم الزاوية العلوية اليمنى
 */
export function flyToCart(startElement) {
  if (typeof window === "undefined" || !startElement) return;

  const startRect = startElement.getBoundingClientRect();
  const cartTarget = document.getElementById("cart-icon-target");

  // نقطة البداية: مركز الزر
  const startX = startRect.left + startRect.width / 2;
  const startY = startRect.top + startRect.height / 2;

  // نقطة الوصول: مركز أيقونة السلة
  let endX, endY;
  if (cartTarget) {
    const r = cartTarget.getBoundingClientRect();
    endX = r.left + r.width / 2;
    endY = r.top + r.height / 2;
  } else {
    endX = window.innerWidth - 60;
    endY = 40;
  }

  // أنشئ العنصر الطائر
  const dot = document.createElement("div");
  dot.className = "cart-fly-dot";
  dot.innerHTML = '<i class="bi bi-bag-fill"></i>';
  dot.style.left = `${startX}px`;
  dot.style.top = `${startY}px`;
  document.body.appendChild(dot);

  const dx = endX - startX;
  const dy = endY - startY;

  // استخدم Web Animations API (أكثر موثوقية من CSS keyframes مع var)
  const animation = dot.animate(
    [
      {
        transform: "translate(-50%, -50%) scale(0.6)",
        opacity: 0.9,
      },
      {
        // منتصف المسار: يرتفع قليلاً فوق الخط المستقيم
        transform: `translate(calc(-50% + ${dx * 0.5}px), calc(-50% + ${dy * 0.5 - 80}px)) scale(1.35)`,
        opacity: 1,
        offset: 0.5,
      },
      {
        transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`,
        opacity: 0,
      },
    ],
    {
      duration: 850,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      fill: "forwards",
    },
  );

  animation.onfinish = () => {
    dot.remove();

    // 🎯 نبضة على السلة
    if (cartTarget) {
      cartTarget.classList.add("cart-pulse");
      setTimeout(() => cartTarget.classList.remove("cart-pulse"), 700);
    }
  };
}

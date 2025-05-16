

export const handleEventClick = (event, e, setSelectedEvent, setCardPosition, isCardVisible, setIsCardVisible) => {
    if(isCardVisible){
        setIsCardVisible(false);
        setSelectedEvent(null);
        return;
    }
    const target = e.target;
    const rect = target.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const cardWidth = 384; // w-96 in tailwind is 24rem = 384px
    const cardHeight = 200; // Estimated height of the card

    let newLeft = rect.right + window.scrollX;
    let newTop = rect.top + window.scrollY;

    // Adjust left position if the card goes out of the viewport on the right
    if (newLeft + cardWidth > viewportWidth) {
      newLeft = rect.left + window.scrollX - cardWidth;
    }

    // Adjust top position if the card goes out of the viewport at the bottom
    if (newTop + cardHeight > viewportHeight) {
      newTop = viewportHeight - cardHeight + window.scrollY;
    }
     // Ensure the card doesn't go out of the viewport at the top
     if (newTop < window.scrollY) {
      newTop = window.scrollY;
    }

    setSelectedEvent(event);
    setCardPosition({ top: newTop, left: newLeft });
    setIsCardVisible(true);
};

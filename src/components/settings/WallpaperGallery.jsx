const WallpaperGallery = ({ onClose, onSelect }) => {
  const wallpapers = Array.from({length: 8}, (_, i) => ({
    url: `/wallpapers/example${i + 1}.jpg`,
    name: `Example ${i + 1}`
  }));

  const handleWallpaperSelect = (wallpaper) => {
    // Устанавливаем фон
    document.body.style.backgroundImage = `url(${wallpaper.url})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    // Сохраняем URL в localStorage без обертки url()
    localStorage.setItem('faestro-background', wallpaper.url);
    // Вызываем callback
    onSelect?.(wallpaper.url);
  };

  return (
    <div class="settings-detail">
      <div class="detail-header">
        <button onClick={onClose} class="back-button">
          <i class="ri-arrow-left-s-line"></i>
          Back
        </button>
        <h3>Wallpaper Gallery</h3>
      </div>
      <div class="detail-content">
        <div class="wallpaper-grid">
          {wallpapers.map(wp => (
            <div 
              class="wallpaper-item"
              onClick={() => handleWallpaperSelect(wp)}
            >
              <img src={wp.url} alt={wp.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WallpaperGallery;

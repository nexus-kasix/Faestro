const WallpaperGallery = ({ onClose, onSelect }) => {
  const wallpapers = Array.from({length: 8}, (_, i) => ({
    url: `/wallpapers/example${i + 1}.jpg`,
    name: `Example ${i + 1}`
  }));

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
              onClick={() => {
                document.body.style.backgroundImage = `url(${wp.url})`;
                document.body.style.backgroundSize = 'cover';
                document.body.style.backgroundPosition = 'center';
                localStorage.setItem('faestro-background', wp.url);
                onSelect?.();
              }}
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

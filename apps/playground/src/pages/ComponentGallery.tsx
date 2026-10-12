export default function ComponentGallery() {
  return (
    <div className="component-gallery">
      <h2>Component Gallery</h2>
      
      <section className="gallery-section">
        <h3>Buttons</h3>
        <div className="gallery-grid">
          <button className="btn-primary">Primary</button>
          <button className="btn-secondary">Secondary</button>
          <button className="btn-destructive">Destructive</button>
          <button disabled>Disabled</button>
        </div>
      </section>

      <section className="gallery-section">
        <h3>Inputs</h3>
        <div className="gallery-grid">
          <input type="text" placeholder="Text input" />
          <input type="text" value="Filled input" readOnly />
          <select><option>Select option</option></select>
          <textarea placeholder="Textarea"></textarea>
        </div>
      </section>

      <section className="gallery-section">
        <h3>Cards & Surfaces</h3>
        <div className="gallery-grid">
          <div className="card">
            <h4>Default Card</h4>
            <p>Standard card surface</p>
          </div>
          <div className="card card-hover">
            <h4>Hovered Card</h4>
            <p>With hover background</p>
          </div>
          <div className="card card-accent">
            <h4>Accent Card</h4>
            <p>With accent background</p>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <h3>Status Colors</h3>
        <div className="gallery-grid">
          <div className="status-badge status-error">Error</div>
          <div className="status-badge status-success">Success</div>
          <div className="status-badge status-warning">Warning</div>
          <div className="status-badge status-info">Info</div>
        </div>
      </section>
    </div>
  )
}

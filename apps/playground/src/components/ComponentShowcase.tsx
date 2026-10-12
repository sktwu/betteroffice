export default function ComponentShowcase() {
  return (
    <div className="component-showcase">
      <div className="showcase-section">
        <h3>Buttons</h3>
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
        <button className="btn-destructive">Delete</button>
      </div>

      <div className="showcase-section">
        <h3>Form Elements</h3>
        <input type="text" placeholder="Text input" className="form-input" />
        <select className="form-input">
          <option>Select...</option>
        </select>
      </div>

      <div className="showcase-section">
        <h3>Card</h3>
        <div className="card">
          <h4>Card Title</h4>
          <p>This card uses themed colors. Try switching light/dark mode!</p>
          <button className="btn-primary">Action</button>
        </div>
      </div>

      <div className="showcase-section">
        <h3>Status Messages</h3>
        <div className="status-box status-error">❌ Error message example</div>
        <div className="status-box status-success">✅ Success message example</div>
        <div className="status-box status-warning">⚠️ Warning message example</div>
      </div>
    </div>
  )
}

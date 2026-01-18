// static/js/settings.js

window.storeSettings = null;

async function initSettings() {
    try {
        const response = await fetch('/api/get-settings/');
        window.storeSettings = await response.json();
        console.log("✅ Settings synced from database");
    } catch (e) {
        console.error("❌ Failed to load settings, using defaults");
        window.storeSettings = { profitMargin: 20, lowStockLimit: 5, theme: 'light' };
    }
}

window.renderSettings = async function() {
    const container = document.getElementById('settingsContent');
    if (!container) return;

    if (!window.storeSettings) await initSettings();

    const isDark = document.body.classList.contains('dark-mode');

    container.innerHTML = `
        <style>
            .settings-grid-container {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 30px;
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }

            .stylish-card {
                background: white;
                border-radius: 20px;
                padding: 35px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.08);
                border: 2px solid rgba(93, 83, 74, 0.1);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .stylish-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 6px;
                background: linear-gradient(90deg, #cbdfbd 0%, #d4e09b 50%, #f19c79 100%);
            }

            .stylish-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 12px 40px rgba(0,0,0,0.12);
                border-color: rgba(203, 223, 189, 0.4);
            }

            .card-icon {
                font-size: 56px;
                margin-bottom: 20px;
                text-align: center;
                filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
            }

            .card-body h3 {
                color: #5D534A;
                font-size: 1.5rem;
                font-weight: 800;
                margin-bottom: 8px;
                text-align: center;
            }

            .card-body > p {
                color: #9E9382;
                font-size: 14px;
                text-align: center;
                margin-bottom: 30px;
            }

            .control-group {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 15px 20px;
                background: linear-gradient(135deg, rgba(203, 223, 189, 0.08), rgba(212, 224, 155, 0.05));
                border-radius: 12px;
                border: 1px solid rgba(203, 223, 189, 0.2);
            }

            .label-text {
                font-weight: 700;
                color: #5D534A;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .stylish-input {
                width: 120px;
                padding: 12px 16px;
                border: 2px solid rgba(93, 83, 74, 0.2);
                border-radius: 10px;
                font-size: 16px;
                font-weight: 700;
                color: #5D534A;
                text-align: center;
                transition: all 0.3s ease;
                background: white;
            }

            .stylish-input:focus {
                outline: none;
                border-color: #cbdfbd;
                box-shadow: 0 0 0 4px rgba(203, 223, 189, 0.2);
                transform: scale(1.05);
            }

            .stylish-input:hover {
                border-color: #cbdfbd;
            }

            /* Toggle Switch Styling */
            .stylish-switch {
                position: relative;
                display: inline-block;
                width: 70px;
                height: 36px;
            }

            .stylish-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .stylish-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, #e0e0e0 0%, #c8c8c8 100%);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 34px;
                box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
            }

            .stylish-slider:before {
                position: absolute;
                content: "";
                height: 28px;
                width: 28px;
                left: 4px;
                bottom: 4px;
                background: white;
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }

            input:checked + .stylish-slider {
                background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%);
                box-shadow: 0 0 15px rgba(203, 223, 189, 0.4);
            }

            input:checked + .stylish-slider:before {
                transform: translateX(34px);
                box-shadow: 0 2px 12px rgba(0,0,0,0.3);
            }

            .stylish-slider:hover {
                opacity: 0.9;
            }

            /* Save Button */
            .settings-footer {
                text-align: center;
                margin-top: 40px;
                padding: 20px;
            }

            .btn-save-modern {
                padding: 18px 48px;
                background: linear-gradient(135deg, #cbdfbd 0%, #a8c99c 100%);
                color: #3e5235;
                border: none;
                border-radius: 16px;
                font-size: 18px;
                font-weight: 900;
                cursor: pointer;
                text-transform: uppercase;
                letter-spacing: 1.5px;
                box-shadow: 
                    0 8px 25px rgba(203, 223, 189, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.5);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .btn-save-modern:hover {
                transform: translateY(-4px);
                box-shadow: 
                    0 12px 35px rgba(203, 223, 189, 0.6),
                    inset 0 1px 0 rgba(255, 255, 255, 0.6);
                background: linear-gradient(135deg, #d4e09b 0%, #b8cc7d 100%);
            }

            .btn-save-modern:active {
                transform: translateY(-2px);
            }

            /* Dark Mode Overrides */
            body.dark-mode .stylish-card {
                background: rgba(255, 255, 255, 0.05);
                border-color: rgba(203, 223, 189, 0.2);
            }

            body.dark-mode .card-body h3 {
                color: #f9fafb;
            }

            body.dark-mode .card-body > p {
                color: #9ca3af;
            }

            body.dark-mode .label-text {
                color: #d1d5db;
            }

            body.dark-mode .stylish-input {
                background: rgba(255, 255, 255, 0.1);
                color: #f9fafb;
                border-color: rgba(203, 223, 189, 0.3);
            }

            body.dark-mode .control-group {
                background: rgba(203, 223, 189, 0.05);
                border-color: rgba(203, 223, 189, 0.15);
            }

            /* Responsive */
            @media (max-width: 768px) {
                .settings-grid-container {
                    grid-template-columns: 1fr;
                    padding: 15px;
                }

                .stylish-card {
                    padding: 25px;
                }

                .control-group {
                    flex-direction: column;
                    gap: 15px;
                    text-align: center;
                }

                .stylish-input {
                    width: 100%;
                }
            }
        </style>

        <div class="settings-grid-container">
            
            <div class="stylish-card">
                <div class="card-icon">🎨</div>
                <div class="card-body">
                    <h3>Appearance</h3>
                    <p>Workspace theme preferences</p>
                    <div class="control-group">
                        <span class="label-text">Dark Mode</span>
                        <label class="stylish-switch">
                            <input type="checkbox" id="darkThemeSwitch" ${isDark ? 'checked' : ''}>
                            <span class="stylish-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="stylish-card">
                <div class="card-icon">📈</div>
                <div class="card-body">
                    <h3>Inventory & Sales</h3>
                    <p>Global business rules</p>
                    <div class="control-group">
                        <span class="label-text">Profit Margin (%)</span>
                        <input type="number" id="marginInput" value="${window.storeSettings.profitMargin}" class="stylish-input">
                    </div>
                    <div class="control-group">
                        <span class="label-text">Low Stock Alert</span>
                        <input type="number" id="lowStockInput" value="${window.storeSettings.lowStockLimit}" class="stylish-input">
                    </div>
                </div>
            </div>

        </div>

        <div class="settings-footer">
            <button class="btn-save-modern" onclick="saveAllSettings()">💾 Sync to Cloud</button>
        </div>
    `;

    document.getElementById('darkThemeSwitch').onchange = () => window.toggleDarkMode();
};

window.saveAllSettings = async function() {
    const updatedData = {
        profitMargin: parseFloat(document.getElementById('marginInput').value) || 20,
        lowStockLimit: parseInt(document.getElementById('lowStockInput').value) || 5,
        theme: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    };

    try {
        const response = await fetch('/api/save-settings/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            window.storeSettings = updatedData;
            if (window.DialogSystem) {
                DialogSystem.alert('Store logic synced with database!', '✅');
            }
        }
    } catch (error) {
        console.error("Failed to sync settings:", error);
    }
};

initSettings();
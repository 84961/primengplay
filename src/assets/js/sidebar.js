// Sidebar Manager Class
class SidebarManager {
    constructor() {
        this.createSidebarElement();
    }

    createSidebarElement() {
        // Create sidebar container if it doesn't exist
        if (!document.getElementById('custom-sidebar')) {
            const sidebar = document.createElement('div');
            sidebar.id = 'custom-sidebar';
            sidebar.className = 'custom-sidebar';
            sidebar.style.display = 'none';

            // Create close button
            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.innerHTML = '×';
            closeButton.onclick = () => this.closeSidebar();

            // Create iframe container
            const iframeContainer = document.createElement('div');
            iframeContainer.className = 'iframe-container';

            // Create iframe
            const iframe = document.createElement('iframe');
            iframe.id = 'sidebar-iframe';
            
            // Append elements
            iframeContainer.appendChild(iframe);
            sidebar.appendChild(closeButton);
            sidebar.appendChild(iframeContainer);
            document.body.appendChild(sidebar);

            // Add styles
            const styles = document.createElement('style');
            styles.textContent = `
                .custom-sidebar {
                    position: fixed;
                    right: 0;
                    top: 0;
                    width: 40%;
                    height: 100%;
                    background: white;
                    box-shadow: -2px 0 5px rgba(0,0,0,0.2);
                    z-index: 1000;
                    transition: transform 0.3s ease;
                }
                .custom-sidebar.active {
                    display: block !important;
                }
                .close-button {
                    position: absolute;
                    right: 10px;
                    top: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    z-index: 1001;
                }
                .iframe-container {
                    width: 100%;
                    height: 100%;
                    padding: 20px;
                }
                #sidebar-iframe {
                    width: 100%;
                    height: 100%;
                    border: none;
                }
            `;
            document.head.appendChild(styles);
        }
    }

    openSidebar(data) {
        const sidebar = document.getElementById('custom-sidebar');
        const iframe = document.getElementById('sidebar-iframe');
        
        // Create a simple HTML content to display the data
        const content = `
            <html>
                <head>
                    <style>
                        body { 
                            font-family: Arial, sans-serif;
                            padding: 20px;
                            margin: 0;
                        }
                        .data-item {
                            margin-bottom: 15px;
                        }
                        .label {
                            font-weight: bold;
                            color: #666;
                        }
                        .value {
                            margin-top: 5px;
                        }
                    </style>
                </head>
                <body>
                    <h2>Product Details</h2>
                    ${Object.entries(data).map(([key, value]) => `
                        <div class="data-item">
                            <div class="label">${key}:</div>
                            <div class="value">${value}</div>
                        </div>
                    `).join('')}
                </body>
            </html>
        `;

        // Set iframe content
        iframe.srcdoc = content;
        sidebar.style.display = 'block';
        
        // Force reflow and add active class
        sidebar.offsetHeight;
        sidebar.classList.add('active');
    }

    closeSidebar() {
        const sidebar = document.getElementById('custom-sidebar');
        sidebar.classList.remove('active');
        setTimeout(() => {
            sidebar.style.display = 'none';
        }, 300);
    }
}

// Wait for DOM content to be loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Create global instance
    window.sidebarManager = new SidebarManager();

    // Global method to open sidebar with data
    window.openProductSidebar = function(productData) {
        window.sidebarManager.openSidebar(productData);
    }
});
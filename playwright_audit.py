from playwright.sync_api import sync_playwright
import json
import sys

def run_comprehensive_audit():
    results = {
        "pages_tested": [],
        "errors": [],
        "console_logs": [],
        "selectors_found": {},
        "issues": []
    }
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()
        
        # Capture console logs
        page.on("console", lambda msg: results["console_logs"].append({
            "type": msg.type,
            "text": msg.text
        }))
        
        # Capture errors
        page.on("pageerror", lambda err: results["errors"].append(str(err)))
        
        # Test Dashboard (Home Page)
        print("Testing Dashboard...")
        page.goto('http://localhost:3000')
        page.wait_for_load_state('networkidle')
        
        # Take screenshot for visual inspection
        page.screenshot(path='audit_dashboard.png', full_page=True)
        results["pages_tested"].append("/")
        
        # Check for common elements
        selectors = {
            "sidebar": "nav, [class*='sidebar'], [class*='SideBar']",
            "property_cards": "[class*='card'], [class*='property']",
            "buttons": "button",
            "links": "a",
            "tables": "table",
            "forms": "form, input, select",
            "text_elements": "h1, h2, h3, p, span, div"
        }
        
        for name, selector in selectors.items():
            try:
                elements = page.locator(selector).all()
                results["selectors_found"][name] = len(elements)
            except Exception as e:
                results["selectors_found"][name] = f"Error: {e}"
        
        # Check for white-on-white text issues
        text_issues = page.evaluate("""
            () => {
                const issues = [];
                const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, div, a, button, li');
                elements.forEach(el => {
                    const style = window.getComputedStyle(el);
                    const color = style.color;
                    const bgColor = style.backgroundColor;
                    
                    // Check if text is white or very light
                    if (color.includes('rgb(255') || color.includes('rgba(255') || 
                        color.includes('rgb(24') || color.includes('white')) {
                        // Check if background is also white or transparent
                        if (bgColor.includes('255, 255, 255') || bgColor === 'transparent' || 
                            bgColor.includes('rgba(0, 0, 0, 0')) {
                            if (el.textContent.trim().length > 0) {
                                issues.push({
                                    element: el.tagName,
                                    text: el.textContent.trim().substring(0, 50),
                                    color: color,
                                    background: bgColor,
                                    className: el.className
                                });
                            }
                        }
                    }
                });
                return issues;
            }
        """)
        results["issues"].extend([{"type": "white_on_white", "details": issue} for issue in text_issues[:20]])
        
        # Test API endpoints
        print("Testing API endpoints...")
        api_tests = [
            "/api/properties",
            "/api/analysis/what-if/scenarios"
        ]
        
        for endpoint in api_tests:
            try:
                response = page.goto(f'http://localhost:3000{endpoint}')
                if response:
                    results["pages_tested"].append(f"{endpoint} (Status: {response.status})")
                else:
                    results["pages_tested"].append(f"{endpoint} (No response)")
            except Exception as e:
                results["pages_tested"].append(f"{endpoint} (Error: {e})")
        
        browser.close()
    
    # Save results
    with open('audit_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("Audit complete. Results saved to audit_results.json")
    print(f"Pages tested: {len(results['pages_tested'])}")
    print(f"Errors found: {len(results['errors'])}")
    print(f"Console logs: {len(results['console_logs'])}")
    print(f"White-on-white issues: {len(text_issues)}")

if __name__ == "__main__":
    run_comprehensive_audit()

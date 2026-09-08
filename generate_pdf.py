import os
import sys

def sanitize(txt):
    replacements = {
        '—': ' - ',
        '–': '-',
        '’': "'",
        '‘': "'",
        '“': '"',
        '”': '"',
        '•': '*',
        '…': '...',
        '→': '->',
        '₹': 'Rs. ',
    }
    for k, v in replacements.items():
        txt = txt.replace(k, v)
    return txt

def create_paimana_summary_pdf(filename):
    W = 595.28
    H = 841.89

    stream_ops = []

    def rgb(r, g, b):
        return f"{r:.3f} {g:.3f} {b:.3f}"

    def set_fill(r, g, b):
        stream_ops.append(f"{rgb(r, g, b)} rg")

    def set_stroke(r, g, b):
        stream_ops.append(f"{rgb(r, g, b)} RG")

    def set_line_width(w):
        stream_ops.append(f"{w:.2f} w")

    def rect(x, y, w, h, fill=True, stroke=False):
        op = "B" if (fill and stroke) else ("f" if fill else "s")
        stream_ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re {op}")

    def text(x, y, txt, font="F1", size=9, r=0, g=0, b=0):
        txt = sanitize(txt)
        esc = txt.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        stream_ops.append(f"BT /{font} {size} Tf {rgb(r,g,b)} rg {x:.2f} {y:.2f} Td ({esc}) Tj ET")

    # ==================== 1. HEADER BANNER ====================
    # Dark blue main header
    set_fill(0.05, 0.28, 0.63) # #0D47A1
    rect(24, 768, 547, 54, fill=True, stroke=False)

    # Orange accent bar at top
    set_fill(1.0, 0.56, 0.0) # #FF8F00
    rect(24, 820, 547, 3, fill=True, stroke=False)

    # Logo badge box
    set_fill(1.0, 1.0, 1.0)
    rect(34, 777, 36, 36, fill=True, stroke=False)
    text(45, 787, "P", font="F2", size=22, r=0.08, g=0.39, b=0.75)

    # Main Title
    text(78, 798, "PAIMANA - Delay-Prediction Platform", font="F2", size=14.5, r=1, g=1, b=1)
    text(78, 786, "Comprehensive Frontend Architecture & Codebase Summary", font="F1", size=8.5, r=0.73, g=0.87, b=0.98)
    text(78, 775, "React 18  |  TypeScript  |  Vite  |  MUI v5  |  TanStack Query  |  Recharts  |  XAI Engine", font="F3", size=7.2, r=0.9, g=0.95, b=1.0)

    # Header Right Badge
    set_fill(0.08, 0.35, 0.72)
    rect(450, 775, 112, 38, fill=True, stroke=False)
    set_stroke(1.0, 1.0, 1.0)
    set_line_width(0.5)
    rect(450, 775, 112, 38, fill=False, stroke=True)
    text(457, 799, "52 PRODUCTION FILES", font="F2", size=7.8, r=1.0, g=0.85, b=0.3)
    text(457, 788, "Status: Complete & Verified", font="F1", size=7.0, r=1, g=1, b=1)
    text(457, 779, "Scope: Full Frontend System", font="F3", size=6.5, r=0.8, g=0.9, b=1.0)

    # ==================== 2. KPI METRIC CARDS ====================
    kpis = [
        ("TOTAL CODEBASE", "52 Files", "Strict TS, Modular Architecture", (0.08, 0.39, 0.75)),
        ("TECH STACK", "React 18 + TS", "Vite + MUI v5 + TanStack Query", (0.18, 0.49, 0.20)),
        ("USER JOURNEY", "7 Core Screens", "Portfolio -> Sector -> Project XAI", (0.85, 0.35, 0.0)),
        ("EXPLAINABLE ML", "SHAP / Factors", "Feature Importance & Waterfalls", (0.75, 0.15, 0.15))
    ]
    card_w = 131
    for i, (label, val, sub, col) in enumerate(kpis):
        cx = 24 + i * (card_w + 7.5)
        cy = 724
        set_fill(0.96, 0.97, 0.99)
        rect(cx, cy, card_w, 36, fill=True, stroke=False)
        set_fill(*col)
        rect(cx, cy, 3.5, 36, fill=True, stroke=False)
        set_stroke(0.85, 0.88, 0.92)
        set_line_width(0.5)
        rect(cx, cy, card_w, 36, fill=False, stroke=True)
        text(cx + 8, cy + 26, label, font="F2", size=6.5, r=0.4, g=0.45, b=0.5)
        text(cx + 8, cy + 13, val, font="F2", size=11, r=col[0], g=col[1], b=col[2])
        text(cx + 8, cy + 4.5, sub, font="F1", size=6.0, r=0.45, g=0.5, b=0.55)

    # ==================== LAYOUT CONFIG ====================
    col_w = 268
    col1_x = 24
    col2_x = 303

    def draw_box(x, y, w, h, title, title_bg=(0.92, 0.94, 0.97), title_fg=(0.08, 0.35, 0.7)):
        set_fill(1.0, 1.0, 1.0)
        rect(x, y, w, h, fill=True, stroke=False)
        set_fill(*title_bg)
        rect(x, y + h - 16, w, 16, fill=True, stroke=False)
        set_stroke(0.83, 0.86, 0.90)
        set_line_width(0.6)
        rect(x, y, w, h, fill=False, stroke=True)
        text(x + 7, y + h - 12, title, font="F2", size=7.8, r=title_fg[0], g=title_fg[1], b=title_fg[2])

    # =======================================================
    # LEFT COLUMN: Total Height = 668 pt (y: 48 to 716)
    # Card 1: y = 606, h = 110 (Top = 716)
    # Card 2: y = 398, h = 198 (Top = 596)
    # Card 3: y = 232, h = 156 (Top = 388)
    # Card 4: y = 48,  h = 174 (Top = 222)
    # =======================================================

    # --- CARD 1: Architectural Patterns (y: 606, h: 110) ---
    draw_box(col1_x, 606, col_w, 110, "1. ARCHITECTURAL PATTERNS & DATA FLOW")
    arch_items = [
        ("Layered Architecture", "Config -> Types -> API Layer -> Hooks -> Components -> Pages."),
        ("TanStack Query (v4)", "Server state cache, 5-min staleTime, background refetch & polling."),
        ("Axios Interceptors", "Attaches JWT Bearer token; handles 401s; includes offline demo fallback."),
        ("Centralized Types", "Strict TypeScript contracts across Project, Prediction, Alert, Auth."),
        ("Responsive Layout", "Collapsible MUI drawer, responsive topbar, live unread alert counter."),
    ]
    cur_y = 688
    for heading, desc in arch_items:
        set_fill(0.08, 0.39, 0.75)
        rect(col1_x + 8, cur_y + 1, 3, 3, fill=True, stroke=False)
        text(col1_x + 15, cur_y, heading + ":", font="F2", size=6.8, r=0.1, g=0.15, b=0.2)
        text(col1_x + 15, cur_y - 7.5, desc, font="F1", size=6.2, r=0.35, g=0.38, b=0.42)
        cur_y -= 16.0

    # --- CARD 2: Codebase Inventory (y: 398, h: 198) ---
    draw_box(col1_x, 398, col_w, 198, "2. CODEBASE INVENTORY (52 PRODUCTION FILES)")
    dirs = [
        ("src/api/ (6 files)", "Axios client & API services", [
            "client.ts (Axios base), projects.ts (list, getById, byState)",
            "predictions.ts (ML data), alerts.ts (list, markRead, count)",
            "sectors.ts (aggregates), upload.ts (multipart CUF uploader)"
        ]),
        ("src/hooks/ (5 files)", "TanStack Query cache hooks", [
            "useProjects (pagination), usePredictions (project & trends)",
            "useAlerts (polling + read), useSectors (summary metrics)",
            "useUpload (upload mutation with progress tracking)"
        ]),
        ("src/components/ (16 files)", "Reusable visual components", [
            "charts/ (4): DelayDistribution, SectorBar, RiskTrend, Waterfall",
            "dashboard/ (4): KPICards, AlertsFeed, PortfolioTable, IndiaHeatmap",
            "project/ (4): ProjectHeader, PredictionCard, Factors, Timeline",
            "common/ (3) & upload/ (1): Badges, Spinners, Dropzone"
        ]),
        ("src/pages/ (7 files)", "Full routed application screens", [
            "LoginPage, DashboardPage, SectorsPage, SectorDetailPage,",
            "ProjectDetailPage, AlertsPage, UploadPage"
        ]),
        ("src/types/ & utils/ (7 files)", "Data contracts & formatters", [
            "types/ (5): project, prediction, alert, auth, index barrel",
            "utils/ (2): formatters (INR Cr/L, dates), constants (colors)"
        ]),
        ("Root & Layouts (11 files)", "Config, theme, shell, entry", [
            "main.tsx, App.tsx, DashboardLayout.tsx, AuthContext.tsx,",
            "theme.ts, vite.config.ts, tsconfig.json, package.json"
        ])
    ]
    cur_y = 568
    for d_name, d_desc, d_files in dirs:
        set_fill(0.95, 0.96, 0.98)
        rect(col1_x + 6, cur_y - 1, col_w - 12, 9, fill=True, stroke=False)
        text(col1_x + 9, cur_y + 0.8, d_name, font="F2", size=6.5, r=0.08, g=0.35, b=0.65)
        text(col1_x + 115, cur_y + 0.8, "- " + d_desc, font="F3", size=5.8, r=0.45, g=0.5, b=0.55)
        cur_y -= 8.5
        for f in d_files:
            text(col1_x + 13, cur_y, "- " + f, font="F1", size=5.8, r=0.25, g=0.28, b=0.32)
            cur_y -= 7.0
        cur_y -= 2.0

    # --- CARD 3: Core Domain Models (y: 232, h: 156) ---
    draw_box(col1_x, 232, col_w, 156, "3. KEY DOMAIN INTERFACES & SCHEMAS")
    schemas = [
        ("Project & Portfolio Model", [
            "id: string; name: string; sector: string; state: string",
            "sanctionedCost: number; physicalProgress: number (%)",
            "delayDays: number; status: on_track | at_risk | delayed",
            "riskLevel: low | medium | high | critical"
        ]),
        ("DelayPrediction & XAI Model", [
            "predictedDelayDays: number; confidence: number (0.0 - 1.0)",
            "riskScore: number; factors: DelayFactor[] (feature weights)",
            "factors: { name, importance, direction: inc/dec_delay }"
        ]),
        ("Alerts & Ingestion Models", [
            "Alert: id, severity (info/warning/critical), category, isRead",
            "UploadResult: recordsProcessed, recordsSkipped, errors[]"
        ])
    ]
    cur_y = 360
    for sc_title, fields in schemas:
        text(col1_x + 8, cur_y, sc_title, font="F2", size=6.8, r=0.15, g=0.45, b=0.2)
        cur_y -= 8.0
        for fld in fields:
            text(col1_x + 14, cur_y, fld, font="F1", size=5.8, r=0.3, g=0.33, b=0.38)
            cur_y -= 7.0
        cur_y -= 3.0

    # --- CARD 4: Quickstart & Setup (y: 48, h: 174) ---
    draw_box(col1_x, 48, col_w, 174, "4. QUICKSTART & EXECUTION MATRIX")
    cmds = [
        ("Directory Path", "/Users/.../scratch/paimana-frontend"),
        ("1. Install Deps", "npm install (React 18, MUI v5, Recharts, Vite)"),
        ("2. Configure Env", "cp .env.example .env (VITE_API_BASE_URL)"),
        ("3. Run Dev Server", "npm run dev -> http://localhost:3000 (Port 3000)"),
        ("4. Typecheck & Build", "npm run build (tsc && vite build -> dist/)"),
        ("5. Demo Credentials", "analyst@paimana.gov.in / demo (Auto-fallback)"),
        ("6. API Proxy", "Vite proxies /api to http://localhost:8000/api/v1")
    ]
    cur_y = 194
    for label, cmd_txt in cmds:
        text(col1_x + 8, cur_y, label + ":", font="F2", size=6.6, r=0.1, g=0.15, b=0.2)
        set_fill(0.95, 0.96, 0.97)
        rect(col1_x + 8, cur_y - 9.0, col_w - 16, 9.0, fill=True, stroke=False)
        text(col1_x + 12, cur_y - 7.0, cmd_txt, font="F1", size=5.9, r=0.1, g=0.3, b=0.6)
        cur_y -= 19.5

    # =======================================================
    # RIGHT COLUMN: Total Height = 668 pt (y: 48 to 716)
    # Card 5: y = 505, h = 211 (Top = 716)
    # Card 6: y = 253, h = 240 (Top = 493)
    # Card 7: y = 48,  h = 193 (Top = 241)
    # =======================================================

    # --- CARD 5: User Journey & Screens (y: 505, h: 211) ---
    draw_box(col2_x, 505, col_w, 211, "5. USER JOURNEY & SCREEN DRILL-DOWN FLOW")
    
    # Workflow diagram bar
    set_fill(0.92, 0.95, 0.99)
    rect(col2_x + 6, 686, col_w - 12, 10, fill=True, stroke=False)
    text(col2_x + 10, 689, "PORTFOLIO -> SECTOR -> PROJECT -> ML ROOT CAUSE", font="F2", size=6.0, r=0.08, g=0.35, b=0.7)

    screens = [
        ("Dashboard Screen (/)", "Executive portfolio command center", [
            "4 Key KPI Cards: Total Projects, At-Risk Count, Avg Delay, Confidence.",
            "Sector Delay Bar Chart: Horizontal bars ranked by average delay.",
            "Delay Distribution Histogram: Project volume across delay day buckets.",
            "India SVG Choropleth Map: Interactive state-level average delay heatmap.",
            "Project DataGrid: Server-paginated table with risk badges and status chips.",
            "Alerts Feed: Live ticker showing top 5 urgent risk notifications."
        ]),
        ("Sectors & Sector Detail (/sectors, /sectors/:id)", "Thematic breakdown", [
            "Sector Grid: Cards showing project count, total budget, risk counts, progress.",
            "Sector Detail View: Filtered view of projects isolated to a single sector."
        ]),
        ("Project Detail & XAI Drill-Down (/projects/:id)", "Explainable AI deep-dive", [
            "Project Header: Metadata (State, Sanctioned Cost, Contractor, Start/End).",
            "Prediction Card: Predicted delay (days), Confidence %, Composite Risk Gauge.",
            "Feature Importance ('Why this prediction?'): Top 8 delay drivers.",
            "Factor Waterfall Chart: Visualizes positive & negative delay contributors.",
            "Historical Delay Trend: Predicted vs actual delay tracking over project life.",
            "Project Timeline: Milestone tracking (Start, Expected, Revised Completion)."
        ]),
        ("Alerts Command Center (/alerts)", "Active anomaly & risk monitoring", [
            "Severity and Category filters with real-time mark-as-read mutation.",
            "Alert categories: Delay Risk, Cost Overrun, Stalled, Missed Milestones."
        ]),
        ("CUF Data Ingestion (/upload)", "Ministry data synchronization", [
            "Drag & Drop File Upload: Supports .xlsx and .csv Central Utilization Files.",
            "Upload progress tracking, record count validation, and batch error report."
        ])
    ]
    cur_y = 673
    for s_title, s_sub, s_pts in screens:
        text(col2_x + 8, cur_y, s_title, font="F2", size=6.7, r=0.08, g=0.35, b=0.65)
        text(col2_x + 140, cur_y, "| " + s_sub, font="F3", size=5.7, r=0.45, g=0.48, b=0.52)
        cur_y -= 7.8
        for pt in s_pts:
            set_fill(0.85, 0.45, 0.1)
            rect(col2_x + 9, cur_y + 1, 2.5, 2.5, fill=True, stroke=False)
            text(col2_x + 15, cur_y, pt, font="F1", size=5.8, r=0.25, g=0.28, b=0.32)
            cur_y -= 6.8
        cur_y -= 2.6

    # --- CARD 6: Architectural Highlights (y: 253, h: 240) ---
    draw_box(col2_x, 253, col_w, 240, "6. ENGINEERING EXCELLENCE & HACKATHON FOCUS")
    highlights = [
        ("Explainable AI (No Black Box)", [
            "Unlike opaque delay estimates, the UI directly exposes top predictive",
            "features with directional bars (red = increases delay, green = decreases),",
            "giving government officials actionable, transparent explanations."
        ]),
        ("Hackathon-Resilient Offline Demo Fallback", [
            "AuthContext and API client feature an automatic mock fallback mode:",
            "if the backend service is offline, login still succeeds and UI maintains",
            "full demoability without unexpected HTTP network crashes."
        ]),
        ("Indian Public Infrastructure Specialization", [
            "Native currency formatter uses Indian numbering system (INR Lakhs & Crores),",
            "pre-configured with all 28 states & 8 UTs and MoSPI sector definitions."
        ]),
        ("Performance & Caching Strategy", [
            "TanStack Query caches prediction results with 5-minute stale times,",
            "preventing heavy ML re-scoring calls during rapid user navigation.",
            "Server-side pagination ensures the UI stays responsive with 10k+ projects."
        ])
    ]
    cur_y = 464
    for h_title, h_pts in highlights:
        text(col2_x + 8, cur_y, h_title, font="F2", size=6.8, r=0.75, g=0.2, b=0.1)
        cur_y -= 8.5
        for pt in h_pts:
            text(col2_x + 14, cur_y, pt, font="F1", size=6.0, r=0.25, g=0.28, b=0.32)
            cur_y -= 7.5
        cur_y -= 3.5

    # --- CARD 7: Technology Stack Matrix (y: 48, h: 193) ---
    draw_box(col2_x, 48, col_w, 193, "7. COMPLETE TECH STACK SPECIFICATION")
    stack_rows = [
        ("Framework", "React 18 (Vite SPA)", "High-performance ESM bundling, fast HMR"),
        ("Language", "TypeScript 5.2 (Strict)", "Strong typing across all backend APIs & models"),
        ("Design System", "Material UI v5 (MUI)", "Professional design, DataGrid, modern theme"),
        ("Charts Engine", "Recharts (SVG)", "Bar, line, waterfall & distribution charts"),
        ("Geo Heatmap", "react-simple-maps + D3", "Interactive vector choropleth map of India"),
        ("Server State", "TanStack React Query v4", "Deduplication, caching, auto-refetch, polling"),
        ("Routing", "React Router v6", "Nested layouts, dynamic routes, ProtectedRoute"),
        ("Form / Files", "React Hook Form + HTML5", "Multipart CUF upload with real-time progress"),
        ("Auth Storage", "JWT + localStorage", "Bearer token injection via Axios interceptor"),
        ("Icons", "MUI Icons Material", "Standard iconography for sectors, alerts, statuses")
    ]
    cur_y = 208
    for category, tech, note in stack_rows:
        set_fill(0.96, 0.97, 0.98)
        rect(col2_x + 6, cur_y - 2.0, col_w - 12, 10.5, fill=True, stroke=False)
        text(col2_x + 9, cur_y + 0.5, category, font="F2", size=6.0, r=0.15, g=0.2, b=0.25)
        text(col2_x + 68, cur_y + 0.5, tech, font="F2", size=6.0, r=0.08, g=0.35, b=0.7)
        text(col2_x + 160, cur_y + 0.5, note, font="F1", size=5.4, r=0.42, g=0.45, b=0.48)
        cur_y -= 14.0

    # ==================== 8. FOOTER BAR ====================
    set_fill(0.94, 0.95, 0.97)
    rect(24, 25, 547, 18, fill=True, stroke=False)
    set_stroke(0.82, 0.85, 0.88)
    set_line_width(0.5)
    rect(24, 25, 547, 18, fill=False, stroke=True)

    text(32, 31, "PAIMANA Platform Summary  |  Codebase Path: /scratch/paimana-frontend  |  Target Audience: Officials & Analysts", font="F1", size=6.5, r=0.35, g=0.4, b=0.45)
    text(505, 31, "Page 1 of 1", font="F2", size=6.5, r=0.1, g=0.25, b=0.55)

    # --- SERIALIZE PDF ---
    content_stream = "\n".join(stream_ops)
    stream_bytes = content_stream.encode('latin1')

    objects = []
    def add_obj(body):
        objects.append(body)
        return len(objects)

    add_obj("<< /Type /Catalog /Pages 2 0 R >>")
    add_obj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    add_obj(f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {W:.2f} {H:.2f}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R /F3 7 0 R >> >> >>")
    add_obj(f"<< /Length {len(stream_bytes)} >>\nstream\n{content_stream}\nendstream")
    add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
    add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")
    add_obj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>")

    out = ["%PDF-1.4\n%\xE2\xE3\xCF\xD3\n"]
    offsets = []
    for i, obj in enumerate(objects, 1):
        offsets.append(sum(len(x.encode('latin1')) for x in out))
        out.append(f"{i} 0 obj\n{obj}\nendobj\n")

    xref_pos = sum(len(x.encode('latin1')) for x in out)
    out.append(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n")
    for off in offsets:
        out.append(f"{off:010d} 00000 n \n")

    out.append(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{xref_pos}\n%%EOF\n")

    full_pdf_bytes = "".join(out).encode('latin1')
    with open(filename, 'wb') as f:
        f.write(full_pdf_bytes)

    print(f"Successfully generated {filename} ({len(full_pdf_bytes)} bytes)")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "paimana_summary.pdf"
    create_paimana_summary_pdf(target)

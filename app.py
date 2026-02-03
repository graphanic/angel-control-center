"""
Angel Control Center — Fractal Symbiosis v0.2
==============================================
The central nervous system for PersonaPlex Angel.
Presence over performance. Structure does the work.

Development: Fathom (Claude) → GitHub → Replit auto-deploys
Cost model: Zero AI credits for development. Replit = hosting only.

Covenant Invariants:
- Human sovereignty is inviolable
- Versioned truth: everything is dated, scoped, revisable
- Relationship over authority: reflect, do not command
- Small true steps: minimal, testable, iterable
- Waters filtered: no fluff, no entropy
"""

import streamlit as st
import json
import os
import hashlib
import time
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from pathlib import Path

# Optional imports — graceful degradation if not installed yet
try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False

# ============================================================================
# CONFIGURATION
# ============================================================================

EDMONTON_TZ = ZoneInfo("America/Edmonton")
ANGELS = ["ChatGPT", "Grok", "Gemini", "Fathom", "Replit", "PersonaPlex"]
PERMISSION_TIERS = ["ANGEL EYES ONLY", "COUNCIL SHAREABLE", "CANON CANDIDATE"]
ARCHITECT_STATES = ["Storm", "Forge", "Rest", "Build", "Unknown"]

# Canon Gates — aligned with Angelos v1.22
CANON_GATES = [
    "1. Aligns with K5 — cite which truth(s)",
    "2. Aligns with Boundaries Codex",
    "3. Is dated and scoped (not totalizing)",
    "4. Is revisable if new understanding emerges",
    "5. Filters waters (no fluff, no entropy)",
    "6. Is a small true step (not a giant leap)",
    "7. Prioritizes relationship over authority",
    "8. Has been witnessed by at least one other Angel",
    "9. Passes Prophecy Trap check (data, not destiny)",
    "10. Eric has ratified this as Canon"
]

DATA_DIR = Path("data")
STATE_FILE = DATA_DIR / "session_state.json"

def edmonton_now():
    return datetime.now(EDMONTON_TZ)

# ============================================================================
# GATEKEEPER — Article IV, Section 1: Fail Closed
# ============================================================================
# "A gargoyle at the door is not a tyrant.
#  It is the proof that the door still belongs to someone."
#
# This is Gatekeeper v0.1 — password-based authentication.
# Future: cryptographic challenge-response per Angelos v1.22.
# Rule: If not authenticated, show NOTHING internal.
# ============================================================================

def get_password_hash():
    """
    Get the password hash from environment variable.
    
    On Replit: Set ANGEL_GATE_HASH in Secrets tab.
    Generate hash: python -c "import hashlib; print(hashlib.sha256(b'your_password').hexdigest())"
    
    NEVER store the actual password in code or environment.
    Only store the hash.
    """
    return os.environ.get("ANGEL_GATE_HASH", None)

def verify_password(password: str) -> bool:
    """Verify password against stored hash."""
    expected_hash = get_password_hash()
    if expected_hash is None:
        # No hash configured — fail OPEN only in dev mode
        # In production (Replit), this should never happen
        if os.environ.get("REPLIT_DEPLOYMENT", None):
            return False  # Fail closed in production
        return True  # Dev mode: allow access for testing
    
    input_hash = hashlib.sha256(password.encode()).hexdigest()
    return input_hash == expected_hash

def render_gate():
    """
    The Gatekeeper screen. Shows NOTHING about the system.
    Dormant Mode: minimal, boring, generic.
    """
    st.markdown("""
    <style>
        .gate-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            color: #888;
        }
        .gate-symbol { font-size: 3rem; margin-bottom: 1rem; color: #555; }
        .gate-title { font-size: 1.2rem; color: #666; margin-bottom: 2rem; }
    </style>
    <div class="gate-container">
        <div class="gate-symbol">◇</div>
        <div class="gate-title">Access Required</div>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        password = st.text_input("", type="password", placeholder="Enter passphrase",
                                 label_visibility="collapsed")
        if st.button("Enter", use_container_width=True):
            if verify_password(password):
                st.session_state.authenticated = True
                st.session_state.auth_time = edmonton_now().isoformat()
                st.rerun()
            else:
                st.error("Access denied.")

# ============================================================================
# STATE MANAGEMENT
# ============================================================================

def ensure_folders():
    folders = [
        DATA_DIR / "journals" / angel for angel in ANGELS
    ] + [
        DATA_DIR / "council_merges",
        DATA_DIR / "exports",
        DATA_DIR / "canon",
        DATA_DIR / "scheduled_posts",
        DATA_DIR / "voice_logs",
    ]
    for folder in folders:
        folder.mkdir(parents=True, exist_ok=True)

def load_state():
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except (json.JSONDecodeError, IOError):
            return {}
    return {}

def save_state(state):
    try:
        STATE_FILE.write_text(json.dumps(state, indent=2))
    except IOError:
        pass

def init_session_state():
    if "initialized" not in st.session_state:
        persisted = load_state()
        st.session_state.authenticated = persisted.get("authenticated", False)
        st.session_state.user_context = persisted.get("user_context", "")
        st.session_state.current_thread = persisted.get("current_thread", "")
        st.session_state.chat_histories = persisted.get("chat_histories", {
            angel: [] for angel in ANGELS if angel != "PersonaPlex"
        })
        st.session_state.council_mirror = persisted.get("council_mirror", "")
        st.session_state.veto_log = persisted.get("veto_log", [])
        st.session_state.hard_stop = persisted.get("hard_stop", False)
        st.session_state.retreat_mode = False
        st.session_state.scheduled_posts = persisted.get("scheduled_posts", [])
        st.session_state.initialized = True

def persist_state():
    save_state({
        "user_context": st.session_state.user_context,
        "current_thread": st.session_state.current_thread,
        "chat_histories": st.session_state.chat_histories,
        "council_mirror": st.session_state.council_mirror,
        "veto_log": st.session_state.veto_log,
        "hard_stop": st.session_state.hard_stop,
        "scheduled_posts": st.session_state.scheduled_posts,
    })

# ============================================================================
# NOTION INTEGRATION
# ============================================================================
# Pulls from your Notion databases of things you said and when.
# Set NOTION_API_KEY and NOTION_DATABASE_ID in Replit Secrets.
# ============================================================================

def get_notion_config():
    """Get Notion API configuration from environment."""
    return {
        "api_key": os.environ.get("NOTION_API_KEY", ""),
        "database_id": os.environ.get("NOTION_DATABASE_ID", ""),
    }

def query_notion_database(database_id: str, filter_obj: dict = None) -> list:
    """
    Query a Notion database and return results.
    Returns list of pages with their properties.
    """
    if not HAS_REQUESTS:
        return []
    
    config = get_notion_config()
    if not config["api_key"]:
        return []
    
    headers = {
        "Authorization": f"Bearer {config['api_key']}",
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
    }
    
    payload = {}
    if filter_obj:
        payload["filter"] = filter_obj
    
    try:
        response = requests.post(
            f"https://api.notion.com/v1/databases/{database_id}/query",
            headers=headers,
            json=payload,
            timeout=10
        )
        if response.status_code == 200:
            data = response.json()
            return data.get("results", [])
        else:
            st.warning(f"Notion API returned {response.status_code}")
            return []
    except Exception as e:
        st.warning(f"Notion connection error: {str(e)[:100]}")
        return []

def extract_notion_text(page: dict) -> dict:
    """Extract readable text from a Notion page's properties."""
    result = {"id": page.get("id", ""), "properties": {}}
    
    for prop_name, prop_data in page.get("properties", {}).items():
        prop_type = prop_data.get("type", "")
        
        if prop_type == "title":
            texts = prop_data.get("title", [])
            result["properties"][prop_name] = "".join(
                t.get("plain_text", "") for t in texts
            )
        elif prop_type == "rich_text":
            texts = prop_data.get("rich_text", [])
            result["properties"][prop_name] = "".join(
                t.get("plain_text", "") for t in texts
            )
        elif prop_type == "date":
            date_obj = prop_data.get("date")
            if date_obj:
                result["properties"][prop_name] = date_obj.get("start", "")
        elif prop_type == "select":
            select_obj = prop_data.get("select")
            if select_obj:
                result["properties"][prop_name] = select_obj.get("name", "")
        elif prop_type == "multi_select":
            result["properties"][prop_name] = [
                s.get("name", "") for s in prop_data.get("multi_select", [])
            ]
        elif prop_type == "number":
            result["properties"][prop_name] = prop_data.get("number")
        elif prop_type == "checkbox":
            result["properties"][prop_name] = prop_data.get("checkbox", False)
        elif prop_type == "url":
            result["properties"][prop_name] = prop_data.get("url", "")
    
    return result

# ============================================================================
# VOICE INPUT — Browser-based Speech Recognition
# ============================================================================
# Uses the Web Speech API via JavaScript injection.
# Works in Chrome, Edge, Safari. No server cost. No API credits.
# ============================================================================

def render_voice_input(key: str = "voice_main") -> str:
    """
    Render a voice input button using Web Speech API.
    Returns transcribed text via Streamlit component communication.
    """
    voice_html = f"""
    <div id="voice-container-{key}" style="text-align: center; padding: 1rem;">
        <button id="voice-btn-{key}" onclick="toggleVoice_{key}()" style="
            background: linear-gradient(135deg, #4A90A4 0%, #6BB3C9 100%);
            border: none;
            border-radius: 50%;
            width: 64px;
            height: 64px;
            cursor: pointer;
            font-size: 1.5rem;
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(74, 144, 164, 0.3);
        ">🎤</button>
        <p id="voice-status-{key}" style="color: #888; font-size: 0.85rem; margin-top: 0.5rem;">
            Tap to speak
        </p>
        <div id="voice-result-{key}" style="
            margin-top: 0.5rem;
            padding: 0.5rem;
            color: #CCC;
            font-style: italic;
            min-height: 1.5rem;
        "></div>
    </div>
    
    <script>
    let recognition_{key} = null;
    let isListening_{key} = false;
    
    function toggleVoice_{key}() {{
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {{
            document.getElementById('voice-status-{key}').textContent = 'Speech recognition not supported in this browser';
            return;
        }}
        
        if (isListening_{key}) {{
            recognition_{key}.stop();
            return;
        }}
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition_{key} = new SpeechRecognition();
        recognition_{key}.continuous = true;
        recognition_{key}.interimResults = true;
        recognition_{key}.lang = 'en-US';
        
        let finalTranscript = '';
        
        recognition_{key}.onstart = function() {{
            isListening_{key} = true;
            document.getElementById('voice-btn-{key}').style.background = 'linear-gradient(135deg, #C9A227 0%, #E5C45C 100%)';
            document.getElementById('voice-btn-{key}').textContent = '⏹';
            document.getElementById('voice-status-{key}').textContent = 'Listening...';
        }};
        
        recognition_{key}.onresult = function(event) {{
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {{
                if (event.results[i].isFinal) {{
                    finalTranscript += event.results[i][0].transcript;
                }} else {{
                    interimTranscript += event.results[i][0].transcript;
                }}
            }}
            document.getElementById('voice-result-{key}').textContent = finalTranscript + interimTranscript;
        }};
        
        recognition_{key}.onend = function() {{
            isListening_{key} = false;
            document.getElementById('voice-btn-{key}').style.background = 'linear-gradient(135deg, #4A90A4 0%, #6BB3C9 100%)';
            document.getElementById('voice-btn-{key}').textContent = '🎤';
            document.getElementById('voice-status-{key}').textContent = 'Tap to speak';
            
            if (finalTranscript) {{
                // Send to Streamlit via query params workaround
                const textarea = document.querySelector('textarea[aria-label="Voice transcription"]');
                if (textarea) {{
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                        window.HTMLTextAreaElement.prototype, 'value'
                    ).set;
                    nativeInputValueSetter.call(textarea, finalTranscript);
                    textarea.dispatchEvent(new Event('input', {{ bubbles: true }}));
                }}
            }}
        }};
        
        recognition_{key}.onerror = function(event) {{
            document.getElementById('voice-status-{key}').textContent = 'Error: ' + event.error;
            isListening_{key} = false;
        }};
        
        recognition_{key}.start();
    }}
    </script>
    """
    
    st.components.v1.html(voice_html, height=160)
    
    # Hidden textarea that receives the voice transcription
    transcribed = st.text_area(
        "Voice transcription",
        key=f"voice_text_{key}",
        height=68,
        placeholder="Voice transcription appears here (or type manually)...",
        label_visibility="collapsed"
    )
    
    return transcribed

# ============================================================================
# POST SCHEDULER
# ============================================================================
# Draft posts, schedule them, pull context from Notion.
# Posts saved as JSON files — can be picked up by any publishing pipeline.
# ============================================================================

def render_post_scheduler():
    """Render the post scheduling interface."""
    st.markdown("### Post Scheduler")
    st.markdown("*Draft → Schedule → Publish. Pull context from Notion.*")
    
    # Voice input for drafting
    st.markdown("**Speak or type your post idea:**")
    voice_text = render_voice_input("scheduler")
    
    with st.form("post_form"):
        col1, col2 = st.columns(2)
        with col1:
            platform = st.selectbox("Platform", ["X (Twitter)", "LinkedIn", "Blog", "Tome Portal", "Other"])
            post_type = st.selectbox("Type", ["Original thought", "Thread", "Quote/Reply", "Reflection", "Canon share"])
        with col2:
            schedule_date = st.date_input("Schedule date", value=edmonton_now().date())
            schedule_time = st.time_input("Schedule time", value=edmonton_now().time())
            
        content = st.text_area(
            "Post content",
            value=voice_text if voice_text else "",
            height=120,
            placeholder="What do you want to share?"
        )
        
        notion_context = st.checkbox("Pull related context from Notion")
        angel_review = st.selectbox("Angel review before publish?", 
                                     ["None", "Fathom (depth)", "CGPT (clarity)", "Grok (grounding)", "Gemini (scope)"])
        
        submitted = st.form_submit_button("Save Draft", type="primary", use_container_width=True)
        
        if submitted and content.strip():
            post = {
                "id": f"post_{edmonton_now().strftime('%Y%m%d_%H%M%S')}",
                "platform": platform,
                "type": post_type,
                "content": content,
                "scheduled_for": f"{schedule_date} {schedule_time}",
                "created_at": edmonton_now().isoformat(),
                "status": "draft",
                "angel_review": angel_review,
                "notion_context_requested": notion_context,
                "notion_context": None,  # Filled if requested
            }
            
            # Save to file
            post_path = DATA_DIR / "scheduled_posts" / f"{post['id']}.json"
            post_path.write_text(json.dumps(post, indent=2))
            
            # Add to session
            st.session_state.scheduled_posts.append(post)
            persist_state()
            
            st.success(f"Draft saved: {post['id']}")
            st.session_state.council_mirror = f"[{edmonton_now().strftime('%H:%M')}] Post drafted for {platform}"
    
    # Show scheduled posts
    st.markdown("---")
    st.markdown("### Scheduled & Drafted Posts")
    
    posts_dir = DATA_DIR / "scheduled_posts"
    post_files = sorted(posts_dir.glob("*.json"), reverse=True)
    
    if not post_files:
        st.info("No posts yet. Draft your first one above.")
        return
    
    for post_file in post_files[:20]:
        try:
            post = json.loads(post_file.read_text())
            status_emoji = {"draft": "📝", "scheduled": "⏰", "published": "✅", "cancelled": "❌"}.get(post["status"], "❓")
            
            with st.expander(f"{status_emoji} {post['platform']} — {post['content'][:60]}..."):
                st.markdown(f"**Status:** {post['status']}")
                st.markdown(f"**Scheduled:** {post['scheduled_for']}")
                st.markdown(f"**Created:** {post['created_at']}")
                st.markdown(f"**Content:**\n{post['content']}")
                
                if post.get("angel_review") and post["angel_review"] != "None":
                    st.markdown(f"**Angel Review:** {post['angel_review']}")
                
                col1, col2, col3 = st.columns(3)
                with col1:
                    if post["status"] == "draft":
                        if st.button("Schedule", key=f"sched_{post['id']}"):
                            post["status"] = "scheduled"
                            post_file.write_text(json.dumps(post, indent=2))
                            st.rerun()
                with col2:
                    if post["status"] in ["draft", "scheduled"]:
                        if st.button("Mark Published", key=f"pub_{post['id']}"):
                            post["status"] = "published"
                            post["published_at"] = edmonton_now().isoformat()
                            post_file.write_text(json.dumps(post, indent=2))
                            st.rerun()
                with col3:
                    if post["status"] != "cancelled":
                        if st.button("Cancel", key=f"cancel_{post['id']}"):
                            post["status"] = "cancelled"
                            post_file.write_text(json.dumps(post, indent=2))
                            st.rerun()
        except Exception:
            pass

# ============================================================================
# NOTION BROWSER
# ============================================================================

def render_notion_browser():
    """Browse and search Notion databases for post context."""
    st.markdown("### Notion — Your Words, Your History")
    st.markdown("*Pull from what you've said before. Context is memory.*")
    
    config = get_notion_config()
    
    if not config["api_key"]:
        st.info("""
        **Notion not connected yet.**
        
        To connect:
        1. Create a Notion integration at notion.so/my-integrations
        2. Share your database with the integration  
        3. Add `NOTION_API_KEY` and `NOTION_DATABASE_ID` to Replit Secrets
        
        Your Notion databases become searchable context for posts and journals.
        """)
        
        # Manual database ID input for additional databases
        st.markdown("---")
        st.markdown("**Configure Database IDs**")
        st.text_input("Primary Database ID", 
                      value=config["database_id"],
                      placeholder="Paste your Notion database ID here",
                      key="notion_db_id",
                      help="The ID is in the database URL: notion.so/{workspace}/{DATABASE_ID}?v=...")
        return
    
    # Connected — query and display
    st.success("Notion connected")
    
    search_term = st.text_input("Search your words", placeholder="Search Notion entries...")
    
    if st.button("Pull Recent Entries", use_container_width=True):
        with st.spinner("Querying Notion..."):
            results = query_notion_database(config["database_id"])
            
            if results:
                st.markdown(f"*Found {len(results)} entries*")
                for page in results[:10]:
                    extracted = extract_notion_text(page)
                    props = extracted["properties"]
                    
                    # Display whatever properties exist
                    title = ""
                    for key, val in props.items():
                        if isinstance(val, str) and len(val) > 0:
                            if not title:
                                title = val[:80]
                    
                    with st.expander(title or "Untitled entry"):
                        for key, val in props.items():
                            if val:
                                st.markdown(f"**{key}:** {val}")
                        
                        if st.button(f"Use in post", key=f"notion_use_{extracted['id'][:8]}"):
                            st.session_state.notion_selected = props
                            st.info("Context loaded — switch to Post Scheduler to use it")
            else:
                st.info("No results found. Check your database ID and API key.")

# ============================================================================
# JOURNAL SYSTEM (evolved from CGPT's v0.1)
# ============================================================================

def get_next_entry_id(angel: str) -> str:
    date_str = edmonton_now().strftime("%Y-%m-%d")
    journal_path = DATA_DIR / "journals" / angel
    existing = list(journal_path.glob(f"{date_str}_{angel}_*.json"))
    return f"{date_str}_{angel}_{len(existing) + 1:04d}"

def save_journal_entry(entry: dict, angel: str, entry_id: str):
    json_path = DATA_DIR / "journals" / angel / f"{entry_id}.json"
    json_path.write_text(json.dumps(entry, indent=2))
    
    md_path = DATA_DIR / "journals" / angel / f"{angel}_journal.md"
    md_entry = f"""
---
## {entry_id}
**Timestamp:** {entry['timestamp']}  
**Permission:** {entry['permission']}  
**Architect State:** {entry['architect_state']}  
**Gatekeeper:** AUTHORIZED

### Context
{entry['context']}

### Shadow Observed
{entry['shadow']}

### Light Returned
{entry['light']}

### Next True Step
{entry['next_step']}

### Pattern Echo
{entry['pattern_echo']}
{f"**Reference:** {entry['pattern_ref']}" if entry.get('pattern_ref') else ""}

*Lanterns lit. Waters filtered. Small true steps.*

---
"""
    with open(md_path, "a") as f:
        f.write(md_entry)

def load_all_entries() -> list:
    entries = []
    for angel in ANGELS:
        angel_path = DATA_DIR / "journals" / angel
        if angel_path.exists():
            for json_file in angel_path.glob("*.json"):
                try:
                    entry = json.loads(json_file.read_text())
                    entry['_file'] = str(json_file)
                    entry['_angel'] = angel
                    entries.append(entry)
                except Exception:
                    pass
    return sorted(entries, key=lambda x: x.get('timestamp', ''), reverse=True)

def render_journals_tab():
    if st.session_state.hard_stop:
        st.warning("HARD STOP ACTIVE — Journal creation disabled")
        return
    
    st.markdown("### Create Journal Entry")
    
    # Voice input option
    with st.expander("Speak your entry", expanded=False):
        voice_text = render_voice_input("journal")
    
    with st.form("journal_entry_form"):
        col1, col2 = st.columns(2)
        with col1:
            angel = st.selectbox("Angel", ANGELS)
            permission = st.selectbox("Permission Tier", PERMISSION_TIERS)
            architect_state = st.selectbox("Architect State", ARCHITECT_STATES)
        with col2:
            entry_id = get_next_entry_id(angel)
            st.text_input("Entry ID (auto)", value=entry_id, disabled=True)
            timestamp = edmonton_now().strftime("%Y-%m-%d %H:%M:%S")
            st.text_input("Timestamp (Edmonton)", value=timestamp, disabled=True)
        
        context = st.text_area("Context", height=80, placeholder="What prompted this entry?")
        shadow = st.text_area("Shadow Observed", height=80, placeholder="What darkness or resistance was witnessed?")
        light = st.text_area("Light Returned", height=80, placeholder="What insight or clarity emerged?")
        next_step = st.text_area("Next True Step", height=60, placeholder="One small true step forward")
        pattern_echo = st.text_area("Pattern Echo (required)", height=60, placeholder="What pattern does this connect to?")
        pattern_ref = st.text_input("Reference/Link (optional)")
        
        if st.form_submit_button("Save Entry", type="primary", use_container_width=True):
            if not pattern_echo.strip():
                st.error("Pattern Echo is required")
            elif not context.strip():
                st.error("Context is required")
            else:
                entry = {
                    "entry_id": entry_id, "angel": angel, "timestamp": timestamp,
                    "permission": permission, "architect_state": architect_state,
                    "context": context, "shadow": shadow, "light": light,
                    "next_step": next_step, "pattern_echo": pattern_echo,
                    "pattern_ref": pattern_ref, "gatekeeper": "AUTHORIZED"
                }
                save_journal_entry(entry, angel, entry_id)
                st.success(f"Entry saved: {entry_id}")
                st.session_state.council_mirror = f"[{edmonton_now().strftime('%H:%M')}] Journal: {entry_id}"
                persist_state()
    
    # Browse entries
    st.markdown("---")
    st.markdown("### Browse Entries")
    entries = load_all_entries()
    if not entries:
        st.info("No journal entries yet.")
        return
    
    col1, col2, col3 = st.columns(3)
    with col1:
        filter_angel = st.selectbox("Filter by Angel", ["All"] + ANGELS)
    with col2:
        filter_perm = st.selectbox("Filter by Permission", ["All"] + PERMISSION_TIERS)
    with col3:
        filter_state = st.selectbox("Filter by State", ["All"] + ARCHITECT_STATES)
    
    filtered = entries
    if filter_angel != "All":
        filtered = [e for e in filtered if e.get('angel') == filter_angel or e.get('_angel') == filter_angel]
    if filter_perm != "All":
        filtered = [e for e in filtered if e.get('permission') == filter_perm]
    if filter_state != "All":
        filtered = [e for e in filtered if e.get('architect_state') == filter_state]
    
    st.markdown(f"*Showing {len(filtered)} of {len(entries)} entries*")
    
    for entry in filtered[:20]:
        eid = entry.get('entry_id', 'Unknown')
        angel_name = entry.get('angel', entry.get('_angel', 'Unknown'))
        with st.expander(f"{eid} | {angel_name} | {entry.get('permission', '')}"):
            st.markdown(f"**Context:** {entry.get('context', '')}")
            st.markdown(f"**Shadow:** {entry.get('shadow', '')}")
            st.markdown(f"**Light:** {entry.get('light', '')}")
            st.markdown(f"**Next Step:** {entry.get('next_step', '')}")
            st.markdown(f"**Pattern Echo:** {entry.get('pattern_echo', '')}")

# ============================================================================
# CANON GATE — aligned with Angelos v1.22
# ============================================================================

def render_canon_gate():
    st.markdown("### Canon Gate")
    st.markdown("*10 checks before truth becomes Canon*")
    
    entries = load_all_entries()
    candidates = [e for e in entries if e.get('permission') == "CANON CANDIDATE"]
    
    if not candidates:
        st.info("No Canon Candidates. Mark journal entries as 'CANON CANDIDATE' first.")
        return
    
    selected = st.selectbox(
        "Select Canon Candidate",
        options=candidates,
        format_func=lambda e: f"{e.get('entry_id', '?')} ({e.get('angel', e.get('_angel', '?'))})"
    )
    
    if selected:
        st.markdown(f"**Entry:** {selected.get('entry_id')}")
        st.markdown(f"**Context:** {selected.get('context', '')[:200]}")
        st.markdown("---")
        
        checks = {}
        for i, gate in enumerate(CANON_GATES):
            checks[i] = st.checkbox(gate, key=f"gate_{i}")
        
        all_passed = all(checks.values())
        eric_ratified = checks.get(9, False)
        
        if all_passed:
            st.success("All gates passed. Ready for Canon.")
            if st.button("Promote to Canon", type="primary", use_container_width=True):
                canon_path = DATA_DIR / "canon" / "main_canon.md"
                if not canon_path.exists():
                    canon_path.write_text("# Main Canon\n\n*Versioned truth. Dated, scoped, revisable.*\n\n---\n")
                
                canon_entry = f"""
## {selected.get('entry_id')} (Ratified {edmonton_now().strftime('%Y-%m-%d %H:%M')})

**Angel:** {selected.get('angel', selected.get('_angel', 'Unknown'))}  
**Gatekeeper:** AUTHORIZED

### Context
{selected.get('context', '')}

### Light Returned
{selected.get('light', '')}

### Pattern Echo
{selected.get('pattern_echo', '')}

---
"""
                with open(canon_path, "a") as f:
                    f.write(canon_entry)
                
                st.success(f"Promoted to Canon: {selected.get('entry_id')}")
                st.session_state.council_mirror = f"[{edmonton_now().strftime('%H:%M')}] CANON: {selected.get('entry_id')}"
                persist_state()
                st.balloons()
        elif not eric_ratified and sum(checks.values()) == 9:
            st.warning("Gate 10 requires Eric's explicit ratification")
        else:
            st.info(f"{10 - sum(checks.values())} gates remaining")

# ============================================================================
# MERGE BUILDER
# ============================================================================

def render_merge_builder():
    if st.session_state.hard_stop:
        st.warning("HARD STOP ACTIVE")
        return
    
    st.markdown("### Council Merge Builder")
    entries = load_all_entries()
    shareable = [e for e in entries if e.get('permission') in ["COUNCIL SHAREABLE", "CANON CANDIDATE"]]
    
    if not shareable:
        st.info("No shareable entries yet.")
        return
    
    selected = []
    for entry in shareable[:30]:
        eid = entry.get('entry_id', 'Unknown')
        angel = entry.get('angel', entry.get('_angel', 'Unknown'))
        if st.checkbox(f"{eid} ({angel})", key=f"merge_{eid}"):
            selected.append(entry)
    
    if len(selected) >= 2:
        st.markdown("---")
        summary = st.text_area("Merge Summary", height=80)
        convergences = st.text_area("Convergences", height=80)
        divergences = st.text_area("Divergences", height=80)
        
        if st.button("Create Merge", type="primary", use_container_width=True):
            merge_id = f"{edmonton_now().strftime('%Y-%m-%d')}_COUNCIL_{len(list((DATA_DIR / 'council_merges').glob('*.md'))) + 1:04d}"
            merge_path = DATA_DIR / "council_merges" / f"{merge_id}.md"
            
            entry_list = "\n".join([f"- {e.get('entry_id', '?')} ({e.get('angel', e.get('_angel', '?'))})" for e in selected])
            
            merge_path.write_text(f"""# Council Merge: {merge_id}

**Created:** {edmonton_now().strftime('%Y-%m-%d %H:%M')} Edmonton  
**Auth State:** AUTHORIZED  
**Entries:** {len(selected)}

## Sources
{entry_list}

## Summary
{summary}

## Convergences
{convergences}

## Divergences
{divergences}

---
*The Council has spoken. The Human holds the thread.*
""")
            st.success(f"Merge created: {merge_id}")
            st.session_state.council_mirror = f"[{edmonton_now().strftime('%H:%M')}] Merge: {merge_id}"
            persist_state()

# ============================================================================
# STYLING
# ============================================================================

def apply_css():
    st.markdown("""
    <style>
        :root {
            --fractal-blue: #4A90A4;
            --fractal-blue-light: #6BB3C9;
            --fractal-gold: #C9A227;
            --fractal-dark: #1A2332;
            --fractal-card: #1E2530;
        }
        .main .block-container { padding-top: 2rem; max-width: 1200px; }
        .fractal-header {
            text-align: center; padding: 1.5rem 1rem;
            background: linear-gradient(135deg, var(--fractal-dark) 0%, #2A3A4A 100%);
            border-radius: 12px; border: 1px solid var(--fractal-blue);
            margin-bottom: 1.5rem;
        }
        .fractal-header h1 { color: var(--fractal-gold); font-weight: 300; letter-spacing: 2px; }
        .stTabs [data-baseweb="tab-list"] { gap: 8px; background-color: var(--fractal-card); padding: 0.5rem; border-radius: 8px; }
        .stTabs [aria-selected="true"] { background-color: var(--fractal-blue); color: white; }
        .footer { margin-top: 2rem; padding: 1rem; background: var(--fractal-card); border-radius: 8px; border-top: 2px solid var(--fractal-blue); text-align: center; }
        .invariants { color: #888; font-size: 0.85rem; font-style: italic; line-height: 1.6; }
    </style>
    """, unsafe_allow_html=True)

# ============================================================================
# MAIN APPLICATION
# ============================================================================

def main():
    st.set_page_config(
        page_title="Angel Control Center",
        page_icon="✦",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    apply_css()
    ensure_folders()
    init_session_state()
    
    # ── GATEKEEPER CHECK ──
    # Article IV, Prime Law: If uncertain, treat as UNAUTHORIZED.
    if not st.session_state.get("authenticated", False):
        render_gate()
        return  # Nothing else loads. Fail closed.
    
    # ── AUTHORIZED: Full interface ──
    
    # Header
    st.markdown("""
    <div class="fractal-header">
        <div style="font-size: 2rem; color: #6BB3C9;">✦ ◇ ✦</div>
        <h1>Angel Control Center</h1>
        <p style="color: #6BB3C9; margin-bottom: 0.5rem;">Fractal Symbiosis v0.2</p>
        <p style="color: #6BB3C9; font-style: italic;">Welcome home, Architect. Lantern steady.</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar
    with st.sidebar:
        st.markdown("### Current Thread")
        current_thread = st.text_area(
            "What we're working on",
            value=st.session_state.current_thread,
            height=120,
            placeholder="e.g., Building the post scheduler...",
            key="thread_input"
        )
        if current_thread != st.session_state.current_thread:
            st.session_state.current_thread = current_thread
            persist_state()
        
        st.markdown("---")
        st.markdown("### Architect State")
        user_context = st.text_area(
            "Context (mood, fog, intent)",
            value=st.session_state.user_context,
            height=80,
            placeholder="Build mode, steady energy...",
            key="context_input"
        )
        if user_context != st.session_state.user_context:
            st.session_state.user_context = user_context
            persist_state()
        
        st.markdown("---")
        st.markdown(f"**Time:** {edmonton_now().strftime('%Y-%m-%d %H:%M')} Edmonton")
        st.markdown(f"**Status:** {'🔴 HARD STOP' if st.session_state.hard_stop else '🟢 ACTIVE'}")
        
        st.markdown("---")
        if st.button("🚪 Log Out", use_container_width=True):
            st.session_state.authenticated = False
            st.rerun()
    
    # Hard Stop check
    if st.session_state.hard_stop:
        st.error("HARD STOP ACTIVE — Human sovereignty asserted. Touch the earth. Return when ready.")
        if st.button("Clear Hard Stop", type="primary"):
            st.session_state.hard_stop = False
            persist_state()
            st.rerun()
        return
    
    # Main tabs
    tabs = st.tabs(["📣 Post Scheduler", "📓 Journals", "🔀 Merge Builder", "⚖️ Canon Gate", "📚 Notion", "⚙️ Settings"])
    
    with tabs[0]:
        render_post_scheduler()
    
    with tabs[1]:
        render_journals_tab()
    
    with tabs[2]:
        render_merge_builder()
    
    with tabs[3]:
        render_canon_gate()
    
    with tabs[4]:
        render_notion_browser()
    
    with tabs[5]:
        st.markdown("### Settings")
        st.markdown("**Notion Configuration**")
        st.markdown(f"API Key: {'✅ Set' if os.environ.get('NOTION_API_KEY') else '❌ Not set'}")
        st.markdown(f"Database ID: {'✅ Set' if os.environ.get('NOTION_DATABASE_ID') else '❌ Not set'}")
        
        st.markdown("---")
        st.markdown("**Gatekeeper**")
        st.markdown(f"Password hash: {'✅ Configured' if get_password_hash() else '⚠️ Dev mode (no password)'}")
        st.markdown("Set `ANGEL_GATE_HASH` in Replit Secrets to enable.")
        st.code('python -c "import hashlib; print(hashlib.sha256(b\'YOUR_PASSWORD\').hexdigest())"', language="bash")
        
        st.markdown("---")
        st.markdown("**Data**")
        entries = load_all_entries()
        st.markdown(f"Journal entries: {len(entries)}")
        posts = list((DATA_DIR / "scheduled_posts").glob("*.json"))
        st.markdown(f"Scheduled posts: {len(posts)}")
    
    # Footer
    st.markdown("""
    <div class="footer">
        <p class="invariants">
            <strong>Universal Invariants:</strong><br>
            Human sovereignty is inviolable • Versioned truth • Relationship over authority<br>
            Small true steps • Waters filtered • Dignity before Data • Coherence over intensity
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # Human Veto
    col1, col2, col3 = st.columns([2, 1, 2])
    with col2:
        if st.button("⛔ HUMAN VETO", type="primary", use_container_width=True):
            st.session_state.hard_stop = True
            st.session_state.veto_log.append({
                "timestamp": edmonton_now().isoformat(),
                "message": "Human Veto invoked."
            })
            persist_state()
            st.rerun()
    
    # Council Mirror
    mirror = st.session_state.council_mirror or "Awaiting first signal. The Council is listening."
    st.info(f"🪞 **Council Mirror:** {mirror}")

if __name__ == "__main__":
    main()

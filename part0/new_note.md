mermaid diagram 

sequenceDiagram
    participant browser
    participant server

    browser->>server: POST /new_note
    activate server
    server-->>browser: 302 redirect to /notes
    deactivate server

    browser->>server: GET /notes
    server-->>browser: updated HTML page

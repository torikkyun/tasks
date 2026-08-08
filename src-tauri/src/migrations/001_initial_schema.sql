CREATE TABLE IF NOT EXISTS task_lists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_task_lists_position
    ON task_lists(position);

CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    deadline DATETIME,
    status TEXT NOT NULL DEFAULT 'TODO'
		CHECK (status IN ('TODO','IN_PROGRESS','DONE')),
    is_starred INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,

    parent_task_id TEXT,
    list_id TEXT,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (list_id)
        REFERENCES task_lists(id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tasks_parent_task_id
    ON tasks(parent_task_id);

CREATE INDEX IF NOT EXISTS idx_tasks_list_id
    ON tasks(list_id);

CREATE INDEX IF NOT EXISTS idx_tasks_status
    ON tasks(status);

CREATE INDEX IF NOT EXISTS idx_tasks_deadline
    ON tasks(deadline);

CREATE INDEX IF NOT EXISTS idx_tasks_is_starred
    ON tasks(is_starred);

CREATE INDEX IF NOT EXISTS idx_tasks_position
    ON tasks(position);

CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    color TEXT,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_tags (
    task_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,

    PRIMARY KEY (task_id, tag_id),

    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_task_tags_tag_id
    ON task_tags(tag_id);

CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,

    is_pinned INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    deleted_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_notes_deleted_at
    ON notes(deleted_at);

CREATE INDEX IF NOT EXISTS idx_notes_position
    ON notes(position);

CREATE TABLE IF NOT EXISTS task_notes (
    task_id TEXT NOT NULL,
    note_id TEXT NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (task_id, note_id),

    FOREIGN KEY (task_id)
        REFERENCES tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (note_id)
        REFERENCES notes(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_task_notes_note_id
    ON task_notes(note_id);

CREATE TABLE IF NOT EXISTS list_notes (
    list_id TEXT NOT NULL,
    note_id TEXT NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (list_id, note_id),

    FOREIGN KEY (list_id)
        REFERENCES task_lists(id)
        ON DELETE CASCADE,

    FOREIGN KEY (note_id)
        REFERENCES notes(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_list_notes_note_id
    ON list_notes(note_id);

CREATE TABLE IF NOT EXISTS note_tags (
    note_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,

    PRIMARY KEY (note_id, tag_id),

    FOREIGN KEY (note_id)
        REFERENCES notes(id)
        ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_note_tags_tag_id
    ON note_tags(tag_id);

CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY,

    note_id TEXT NOT NULL,

    type TEXT NOT NULL,

    name TEXT,
    url TEXT,
    file_path TEXT,
    mime_type TEXT,
    size INTEGER,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (note_id)
        REFERENCES notes(id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attachments_note_id
    ON attachments(note_id);

CREATE INDEX IF NOT EXISTS idx_attachments_type
    ON attachments(type);

CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,

    theme TEXT NOT NULL DEFAULT 'system',
    language TEXT NOT NULL DEFAULT 'vi',
    note_retention_days INTEGER NOT NULL DEFAULT 30,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INSERT INTO settings (
--     id,
--     theme,
--     language,
--     note_retention_days,
--     updated_at
-- )
-- SELECT
--     '1',
--     'system',
--     'vi',
--     30,
--     CURRENT_TIMESTAMP
-- WHERE NOT EXISTS (
--     SELECT 1 FROM settings
-- );

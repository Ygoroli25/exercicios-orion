-- Exercício 1 — SQL Básico (PostgreSQL)

-- 1) Tabela cursos
CREATE TABLE IF NOT EXISTS cursos (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome_curso  TEXT NOT NULL UNIQUE
);

-- 2) Tabela alunos
CREATE TABLE IF NOT EXISTS alunos (
  id        INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome      TEXT NOT NULL,
  email     TEXT NOT NULL UNIQUE,
  curso_id  INTEGER NOT NULL,
  CONSTRAINT fk_alunos_curso
    FOREIGN KEY (curso_id)
    REFERENCES cursos(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
);

-- 3) Inserts de exemplo (2–3 cursos)
INSERT INTO cursos (nome_curso) VALUES
  ('Banco de Dados I'),
  ('Programação Web'),
  ('Engenharia de Dados')
ON CONFLICT (nome_curso) DO NOTHING;

-- 4) Inserts de alunos (3–4 alunos), relacionando com cursos
INSERT INTO alunos (nome, email, curso_id) VALUES
  ('Ana Souza',  'ana.souza@example.com',  (SELECT id FROM cursos WHERE nome_curso = 'Banco de Dados I')),
  ('Bruno Lima', 'bruno.lima@example.com', (SELECT id FROM cursos WHERE nome_curso = 'Programação Web')),
  ('Carla Reis', 'carla.reis@example.com', (SELECT id FROM cursos WHERE nome_curso = 'Engenharia de Dados')),
  ('Diego Tan',  'diego.tan@example.com',  (SELECT id FROM cursos WHERE nome_curso = 'Banco de Dados I'));

-- 5) Selects de verificação
-- Todos os alunos
SELECT * FROM alunos;

-- Alunos com nome do curso (só para visualizar melhor)
SELECT a.id, a.nome, a.email, a.curso_id, c.nome_curso
FROM alunos a
JOIN cursos c ON c.id = a.curso_id
ORDER BY a.id;

-- 6) (Opcional) Teste de falha da FK — deve falhar se descomentar
-- INSERT INTO alunos (nome, email, curso_id)
-- VALUES ('Teste FK', 'fk.fail@example.com', 9999);

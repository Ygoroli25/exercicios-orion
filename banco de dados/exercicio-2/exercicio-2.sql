-- Exercício 2 — JOINs e Filtros (PostgreSQL)
-- Usando as tabelas 'alunos' e 'cursos' criadas no Exercício 1.

-- 1) INNER JOIN: nome do aluno + nome do curso
SELECT 
  a.id,
  a.nome  AS aluno,
  c.nome_curso AS curso
FROM alunos a
INNER JOIN cursos c ON c.id = a.curso_id
ORDER BY a.id;

-- 2) WHERE + JOIN: filtrar alunos de um curso específico
-- Use o nome exato que existe na sua base. Exemplo com "Programação Web".
SELECT 
  a.id,
  a.nome,
  a.email
FROM alunos a
JOIN cursos c ON c.id = a.curso_id
WHERE c.nome_curso = 'Programação Web'
ORDER BY a.nome;

-- 3) UPDATE: mover um aluno para outro curso
-- Exemplo: mover "Bruno Lima" para "Engenharia de Dados".
UPDATE alunos
SET curso_id = (SELECT id FROM cursos WHERE nome_curso = 'Engenharia de Dados')
WHERE nome = 'Bruno Lima';

-- Conferência pós-UPDATE (JOIN refletindo a mudança)
SELECT 
  a.id,
  a.nome  AS aluno,
  c.nome_curso AS curso
FROM alunos a
JOIN cursos c ON c.id = a.curso_id
ORDER BY a.id;

-- EXTRA (avançado): cursos sem nenhum aluno matriculado
SELECT 
  c.id,
  c.nome_curso
FROM cursos c
LEFT JOIN alunos a ON a.curso_id = c.id
WHERE a.id IS NULL
ORDER BY c.id;

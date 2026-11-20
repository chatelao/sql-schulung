-- ============================================================================
-- Phase 10 Musterlösungen (L179-L200)
-- ============================================================================

-- Aufgabe 1
SELECT e.employee_id, e.last_name, e.department_id, e.salary
FROM hr.employees e
WHERE e.department_id IN (
  SELECT department_id FROM hr.employees GROUP BY department_id HAVING COUNT(*) >= 10
)
AND e.salary > (
  SELECT AVG(i.salary) FROM hr.employees i WHERE i.department_id = e.department_id
)
ORDER BY e.department_id, e.salary DESC;

-- Aufgabe 2
SELECT d.department_id, d.department_name
FROM hr.departments d
WHERE NOT EXISTS (SELECT 1 FROM hr.employees e WHERE e.department_id = d.department_id);

SELECT department_id FROM hr.departments
MINUS
SELECT department_id FROM hr.employees;

-- Aufgabe 3
CREATE TABLE exam_certificates (
    cert_id   NUMBER(6) CONSTRAINT pk_exam_cert PRIMARY KEY,
    empno     NUMBER(4) CONSTRAINT fk_cert_emp REFERENCES my_emp(empno) ON DELETE CASCADE,
    score     NUMBER(3) CONSTRAINT chk_cert_score CHECK (score BETWEEN 0 AND 100),
    issued_at TIMESTAMP WITH LOCAL TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
DROP TABLE exam_certificates PURGE;

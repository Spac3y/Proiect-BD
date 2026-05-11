USE store;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Detalii_Comanda;
TRUNCATE TABLE Comenzi;
TRUNCATE TABLE Produse;
TRUNCATE TABLE Categorii;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Categorii (id_categorie, nume_categorie) VALUES 
(1, 'Mini'), 
(2, 'Midi');

INSERT INTO Produse (nume, pret, stoc, marime, culoare, imagine_url, id_categorie) VALUES
('ANTOINETTA', 850.00, 5, 'S,M,L', 'Floral', '/static/uploads/ANTOINETTA.jpeg', 1),
('ARIA', 420.00, 10, 'XS,S,M', 'Floral', '/static/uploads/ARIA.jpeg', 2),
('BELLA', 1200.00, 2, 'M,L', 'Floral', '/static/uploads/BELLA.jpeg', 2),
('CARLA', 750.00, 4, 'S,M', 'Floral', '/static/uploads/CARLA.jpeg', 1),
('DALILA', 550.00, 7, 'M,L,XL', 'White', '/static/uploads/DALILA.jpeg', 2),
('ELIZABETH', 890.00, 3, 'S,M', 'Floral', '/static/uploads/ELIZABETH.jpeg', 1),
('EMANUELA', 380.00, 12, 'XS,S,M,L', 'Blue', '/static/uploads/EMANUELA.jpeg', 2),
('FLORA', 950.00, 4, 'S,M', 'Yellow', '/static/uploads/FLORA.jpeg', 2),
('ISADORA', 680.00, 6, 'S,M,L', 'Blue', '/static/uploads/ISADORA.jpeg', 1),
('MIYA', 410.00, 8, 'M,L,XL', 'Floral', '/static/uploads/MIYA.jpeg', 2),
('MONA', 1500.00, 2, 'S', 'Floral', '/static/uploads/MONA.jpeg', 1),
('PATRIZIA', 350.00, 15, 'XS,S,M,L,XL', 'Floral', '/static/uploads/PATRIZIA.jpeg', 2),
('RACHELE', 790.00, 5, 'S,M', 'Floral', '/static/uploads/RACHELE.jpeg', 1),
('RAFFAELLA', 2100.00, 1, 'M', 'Black', '/static/uploads/RAFFAELLA.jpeg', 1),
('ROSIE', 520.00, 9, 'S,M,L', 'Floral', '/static/uploads/ROSIE.jpeg', 1),
('STELLA', 390.00, 11, 'S,M', 'White', '/static/uploads/STELLA.jpeg', 2);
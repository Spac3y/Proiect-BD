USE store;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Detalii_Comanda;
TRUNCATE TABLE Comenzi;
TRUNCATE TABLE Clienti;
TRUNCATE TABLE Produse;
TRUNCATE TABLE Categorii;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Categorii (id_categorie, nume_categorie) VALUES 
(1, 'Mini'), 
(2, 'Midi');

INSERT INTO Produse (nume, pret, stoc, marime, culoare, imagine_url, id_categorie) VALUES
('AMALIA dress', 640.00, 6, 'XS,S,M', 'Black', '/static/uploads/AMALIA.jpeg', 1),
('ANGELINA dress', 780.00, 5, 'S,M', 'Black', '/static/uploads/ANGELINA.jpeg', 1),
('ANTOINETTA dress', 650.00, 5, 'S,M,L', 'Floral', '/static/uploads/ANTOINETTA.jpeg', 2),
('ARIA dress', 620.00, 10, 'XS,S,M', 'Floral', '/static/uploads/ARIA.jpeg', 2),
('BELLA dress', 500.00, 2, 'M,L', 'Floral', '/static/uploads/BELLA.jpeg', 1),
('CARLA dress', 750.00, 4, 'S,M', 'Floral', '/static/uploads/CARLA.jpeg', 1),
('DALILA dress', 870.00, 7, 'M,L,XL', 'Blue', '/static/uploads/DALILA.jpeg', 2),
('DONATELLA dress', 800.00, 11, 'XS,S,M,L', 'White', '/static/uploads/DONATELLA.jpeg', 2),
('ELIZABETH dress', 790.00, 3, 'S,M', 'Floral', '/static/uploads/ELIZABETH.jpeg', 1),
('EMANUELA dress', 480.00, 12, 'XS,S,M,L', 'Blue', '/static/uploads/EMANUELA.jpeg', 1),
('FLORA dress', 550.00, 4, 'S,M', 'Yellow', '/static/uploads/FLORA.jpeg', 1),
('GABRIELLA dress', 730.00, 9, 'XS,S,M,L', 'Blue', '/static/uploads/GABRIELLA.jpeg', 2),
('GIULIA dress', 750.00, 5, 'XS,S,M', 'Blue', '/static/uploads/GIULIA.jpeg', 2),
('ISABELLA dress', 690.00, 7, 'XS,S,M', 'Yellow', '/static/uploads/ISABELLA.jpeg', 1),
('ISADORA dress', 680.00, 6, 'S,M,L', 'Blue', '/static/uploads/ISADORA.jpeg', 1),
('JULIETTA dress', 650.00, 3, 'S,M', 'Yellow', '/static/uploads/JULIETTA.jpeg', 1),
('LILIANA dress', 720.00, 4, 'S,M,L', 'Blue', '/static/uploads/LILIANA.jpeg', 2),
('MIYA dress', 510.00, 8, 'XS,M,L,XL', 'Floral', '/static/uploads/MIYA.jpeg', 1),
('MONA dress', 500.00, 2, 'S', 'Floral', '/static/uploads/MONA.jpeg', 1),
('PATRIZIA dress', 750.00, 15, 'XS,S,M,L,XL', 'Floral', '/static/uploads/PATRIZIA.jpeg', 2),
('RACHELE dress', 690.00, 5, 'S,M', 'Floral', '/static/uploads/RACHELE.jpeg', 1),
('RAFFAELLA dress', 1000.00, 1, 'M', 'Black', '/static/uploads/RAFFAELLA.jpeg', 1),
('ROSIE dress', 720.00, 9, 'S,M,L', 'Blue', '/static/uploads/ROSIE.jpeg', 1),
('SERAFINA dress', 680.00, 9, 'S,M,L', 'White', '/static/uploads/SERAFINA.jpeg', 1),
('STELLA dress', 490.00, 11, 'S,M', 'White', '/static/uploads/STELLA.jpeg', 1);

INSERT INTO Clienti (id_client, nume, telefon, adresa) VALUES
(1, 'Maria Ionescu',   '0721234567', 'Str. Florilor 12, Cluj-Napoca'),
(2, 'Elena Popescu',   '0732345678', 'Bd. Unirii 45, București'),
(3, 'Ana Constantin',  '0743456789', 'Str. Mihai Eminescu 8, Iași'),
(4, 'Cristina Dănilă', '0754567890', 'Aleea Trandafirilor 3, Timișoara'),
(5, 'Laura Marinescu', '0765678901', 'Str. Victoriei 22, Brașov');

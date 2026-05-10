create database if not exists store;
use store;

create table if not exists Categorii (
	id_categorie int primary key not null auto_increment,
    nume_categorie text not null
);

create table if not exists Produse (
	id_produs int primary key not null auto_increment,
    nume text not null,
    pret real not null,
    stoc int not null,
    marime text not null,
    id_categorie int,
	imagine_url text,
    foreign key (id_categorie) references Categorii(id_categorie)
);

create table if not exists Clienti (
	id_client int primary key not null auto_increment,
    nume text not null,
    parola text default null,
    telefon text not null,
    adresa text not null
);

create table if not exists Comenzi (
	id_comanda int primary key not null auto_increment,
    id_client int,
    data_comanda datetime default current_timestamp,
    status_comanda varchar(50) default 'in asteptare',
    total real not null,
    foreign key (id_client) references Clienti(id_client)
);

create table if not exists Detalii_Comanda (
	id_detaliu int primary key not null auto_increment,
    id_comanda int,
    id_produs int,
    id_client int,
    cantitate int not null,
    pret_unitar real not null,
    foreign key(id_comanda) references Comenzi(id_comanda),
    foreign key(id_produs) references Produse(id_produs),
    foreign key(id_client) references Clienti(id_client)
);

create table if not exists Admini (
	id_admin int primary key auto_increment,
	username text not null,
	parola text not null
);

insert into Categorii (nume_categorie) values ('De seara'), ('De zi'), ('Cocktail'), ('Mireasa');

insert into Produse (nume, pret, stoc, marime, imagine_url) values 
('Noir Elegance',      599.99, 5, 'S,M,L',    'https://images.unsplash.com/photo-1566479179817-c9e5e1b5b05e?w=600'),
('Velvet Rouge',       749.99, 3, 'XS,S,M',   'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600'),
('Ivory Dream',        429.99, 8, 'S,M,L,XL', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600'),
('Champagne Cocktail', 519.99, 4, 'S,M,L',    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600');

insert into Admini (username, parola) values ('admin', 'pass');

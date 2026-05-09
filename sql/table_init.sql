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
    foreign key (id_categorie) references Categorii(id_categorie)
);

create table if not exists Clienti (
	id_client int primary key not null auto_increment,
    nume text not null,
    parola text not null,
    telefon text not null,
    adresa text not null
);

create table if not exists Comenzi (
	id_comanda int primary key not null auto_increment,
    id_client int,
    data_comanda datetime not null,
    status_comanda text not null,
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
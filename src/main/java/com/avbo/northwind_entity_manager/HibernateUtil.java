/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.avbo.northwind_entity_manager;

import java.util.Properties;

import org.hibernate.SessionFactory;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.Environment;
import org.hibernate.service.ServiceRegistry;

/**
 *
 * @author Lorenzo
 */

public class HibernateUtil {

    // SessionFactory è l’oggetto principale di Hibernate:
    // crea le sessioni (connessioni logiche al DB)
    private static SessionFactory sessionFactory;

    // Percorso del file SQLite (northwind.db)
    private static String filePath = "northwind.db";

    // Permette di cambiare il percorso del DB da fuori
    public static void setFilePath(String filePath) {
        HibernateUtil.filePath = filePath;
    }

    // Restituisce la SessionFactory (singleton)
    public static SessionFactory getSessionFactory() {

        // Se non è ancora stata creata, la inizializziamo
        if (sessionFactory == null) {
            try {
                // Oggetto configurazione Hibernate
                Configuration configuration = new Configuration();

                // Proprietà equivalenti a quelle del file hibernate.cfg.xml
                Properties settings = new Properties();

                // Driver JDBC per SQLite
                settings.put(Environment.JAKARTA_JDBC_DRIVER, "org.sqlite.JDBC");

                // URL JDBC → punta al file SQLite
                settings.put(Environment.JAKARTA_JDBC_URL, "jdbc:sqlite:" + filePath);

                // Dialetto Hibernate per SQLite
                settings.put(Environment.DIALECT, "org.hibernate.community.dialect.SQLiteDialect");

                // Mostra le query SQL nella console
                settings.put(Environment.SHOW_SQL, "true");

                // Ogni sessione è legata al thread corrente
                settings.put(Environment.CURRENT_SESSION_CONTEXT_CLASS, "thread");

                // Nessuna modifica automatica allo schema del DB
                // (IMPORTANTE: evita che Hibernate modifichi la struttura del DB Northwind)
                settings.put(Environment.HBM2DDL_AUTO, "none");

                // Applica le proprietà alla configurazione
                configuration.setProperties(settings);

                // Registra la classe Entity Shippers
                configuration.addAnnotatedClass(Shippers.class);

                // Costruisce il ServiceRegistry (necessario per creare la SessionFactory)
                ServiceRegistry serviceRegistry = new StandardServiceRegistryBuilder()
                        .applySettings(configuration.getProperties()).build();

                System.out.println("Hibernate Java Config serviceRegistry created");

                // Crea la SessionFactory
                sessionFactory = configuration.buildSessionFactory(serviceRegistry);
                return sessionFactory;

            } catch (Exception e) {
                // In caso di errore stampa lo stack trace
                e.printStackTrace();
            }
        }

        // Se la SessionFactory esiste già, la restituisce
        return sessionFactory;
    }

 

}
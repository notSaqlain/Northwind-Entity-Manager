package com.avbo.northwind_entity_manager.model;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.Transaction;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;

/**
 * DAO per la tabella Suppliers.
 * Contiene tutte le operazioni CRUD.
 */
public class SupplierDao {

    /**
     * DELETE — elimina un supplier tramite ID.
     */
    public boolean deleteSupplier(int id) {
        Transaction transaction = null;

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {

            transaction = session.beginTransaction();

            Supplier supplier = session.get(Supplier.class, id);

            if (supplier != null) {
                session.remove(supplier);
                System.out.println("Supplier rimosso");
                transaction.commit();
                return true;
            }

            transaction.commit();

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }

        return false;
    }

    /**
     * POST — inserisce un nuovo supplier.
     */
    public boolean insertSupplier(Supplier supplier) {
        Transaction transaction = null;

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {

            transaction = session.beginTransaction();

            session.persist(supplier);

            transaction.commit();
            return true;

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            return false;
        }
    }

    /**
     * PUT — aggiorna un supplier esistente.
     */
    public boolean updateSupplier(Supplier supplier) {
        Transaction transaction = null;

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {

            transaction = session.beginTransaction();

            session.merge(supplier);

            transaction.commit();
            return true;

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            return false;
        }
    }

    /**
     * GET — restituisce un supplier tramite ID.
     */
    public Supplier getSupplierById(int id) {
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            return session.get(Supplier.class, id);
        }
    }

    /**
     * GET — restituisce tutti i suppliers.
     */
    public List<Supplier> getAllSuppliers() {

        Transaction transaction = null;
        List<Supplier> list = null;

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {

            transaction = session.beginTransaction();

            CriteriaBuilder builder = session.getCriteriaBuilder();
            CriteriaQuery<Supplier> criteria = builder.createQuery(Supplier.class);
            Root<Supplier> root = criteria.from(Supplier.class);

            criteria.select(root);

            list = session.createQuery(criteria).getResultList();

            transaction.commit();

        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
        }

        return list;
    }
}

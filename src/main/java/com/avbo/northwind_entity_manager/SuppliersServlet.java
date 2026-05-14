package com.avbo.northwind_entity_manager;

import com.avbo.northwind_entity_manager.model.Supplier;
import com.avbo.northwind_entity_manager.model.SupplierDao;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

public class SuppliersServlet extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private SupplierDao dao = new SupplierDao();
    private Gson gson = new Gson();

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);

        // Recupera il percorso reale del file northwind.db
        ServletContext context = config.getServletContext();
        File f = new File(context.getRealPath("northwind.db"));

        // Imposta il percorso del DB in Hibernate
        HibernateUtil.setFilePath(f.getPath());
    }

    // GET
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();

        List<Supplier> list = dao.getAllSuppliers();

        String json = gson.toJson(list);
        out.print(json);
        out.flush();
    }

    // POST
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");

        BufferedReader reader = request.getReader();
        Supplier supplier = gson.fromJson(reader, Supplier.class);

        boolean ok = dao.insertSupplier(supplier);

        JsonObject json = new JsonObject();
        json.addProperty("success", ok);

        response.getWriter().print(json.toString());
    }

    // PUT
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");

        BufferedReader reader = request.getReader();
        Supplier supplier = gson.fromJson(reader, Supplier.class);

        boolean ok = dao.updateSupplier(supplier);

        JsonObject json = new JsonObject();
        json.addProperty("success", ok);

        response.getWriter().print(json.toString());
    }

    // DELETE
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        response.setContentType("application/json");

        // /api/suppliers?id=5
        int id = Integer.parseInt(request.getParameter("id"));

        boolean ok = dao.deleteSupplier(id);

        JsonObject json = new JsonObject();
        json.addProperty("success", ok);

        response.getWriter().print(json.toString());
    }

    @Override
    public String getServletInfo() {
        return "Suppliers REST Servlet";
    }
}

import networkx as nx
import matplotlib.pyplot as plt
from collections import defaultdict

class PapeleriaGrafo:
    def __init__(self):
        self.grafo = nx.Graph()
        self.cargar_productos_iniciales()
        
    def cargar_productos_iniciales(self):
        productos = {
            "Lápiz": {"precio": 1500, "stock": 100},
            "Borrador": {"precio": 1000, "stock": 80},
            "Sacapuntas": {"precio": 1200, "stock": 50},
            "Lapicero": {"precio": 2000, "stock": 120},
            "Regla": {"precio": 3500, "stock": 40},
            "Cuaderno": {"precio": 10000, "stock": 60},
            "Pegamento": {"precio": 5000, "stock": 30},
            "Tijeras": {"precio": 7000, "stock": 25}
        }
        
        for producto, atributos in productos.items():
            self.grafo.add_node(producto, **atributos)
        relaciones = [
            ("Lápiz", "Borrador", {"frecuencia": 0.8}),
            ("Lápiz", "Sacapuntas", {"frecuencia": 0.7}),
            ("Cuaderno", "Lapicero", {"frecuencia": 0.6}),
            ("Regla", "Lápiz", {"frecuencia": 0.5}),
            ("Lápiz", "Cuaderno", {"frecuencia": 0.7}),
            ("Pegamento", "Cuaderno", {"frecuencia": 0.4}),
            ("Pegamento", "Tijeras", {"frecuencia": 0.4})
        ]
        
        self.grafo.add_edges_from(relaciones)
    
    def recomendar_productos(self, producto_principal):
        """Recomienda productos relacionados basado en el grafo"""
        if producto_principal not in self.grafo:
            return []
            
        vecinos = list(self.grafo.neighbors(producto_principal))
        vecinos.sort(key=lambda x: self.grafo[producto_principal][x]["frecuencia"], reverse=True)
        return vecinos
    
    def recomendar_reposicion_stock(self, umbral_stock=30):
        """
        Recomienda reposición de stock basado en:
        1. Productos con stock bajo
        2. Sus relaciones con otros productos
        3. Frecuencia de compra conjunta
        """
        productos_bajo_stock = [nodo for nodo in self.grafo.nodes() 
                              if self.grafo.nodes[nodo]['stock'] < umbral_stock]
        
        if not productos_bajo_stock:
            return []   
        recomendaciones = defaultdict(float)
        
        for producto in productos_bajo_stock:
            vecinos = self.grafo.neighbors(producto) 
            for vecino in vecinos:
                frecuencia = self.grafo[producto][vecino]['frecuencia']
                stock_vecino = self.grafo.nodes[vecino]['stock']
                ponderacion = frecuencia * (1 / (stock_vecino + 1))
                recomendaciones[vecino] += ponderacion
        return sorted(recomendaciones.items(), key=lambda x: x[1], reverse=True)
    
    def visualizar_grafo(self):
        pos = nx.spring_layout(self.grafo)
        plt.figure(figsize=(12, 10))
        node_colors = []
        for node in self.grafo.nodes():
            stock = self.grafo.nodes[node]['stock']
            node_colors.append('red' if stock < 30 else 'skyblue')
        nx.draw(self.grafo, pos, with_labels=True, node_size=2500,node_color=node_colors, font_size=10, alpha=0.9)
        plt.show()
    
    def agregar_producto(self, nombre, precio, stock):
        """Añade un nuevo producto al grafo"""
        self.grafo.add_node(nombre, precio=precio, stock=stock)
        print(f"Producto '{nombre}' agregado correctamente.")
    
    def agregar_relacion(self, producto1, producto2, frecuencia):
        """Establece una relación entre dos productos"""
        if producto1 not in self.grafo or producto2 not in self.grafo:
            print("Error: Uno o ambos productos no existen en el sistema.")
            return
        
        self.grafo.add_edge(producto1, producto2, frecuencia=frecuencia)
        print(f"Relación entre '{producto1}' y '{producto2}' establecida con frecuencia {frecuencia}.")
    
    def mostrar_productos(self):
        """Muestra todos los productos disponibles con su stock"""
        print("\nProductos disponibles:")
        for nodo in self.grafo.nodes():
            precio = self.grafo.nodes[nodo]['precio']
            stock = self.grafo.nodes[nodo]['stock']
            stock_alert = " (STOCK BAJO!)" if stock < 30 else ""
            print(f"- {nodo}: ${precio} | Stock: {stock}{stock_alert}")
    
    def mostrar_relaciones(self):
        """Muestra todas las relaciones entre productos"""
        print("\nRelaciones entre productos:")
        for edge in self.grafo.edges(data=True):
            print(f"{edge[0]} <-> {edge[1]} (Frecuencia: {edge[2]['frecuencia']})")
    
    def actualizar_stock(self, producto, cantidad):
        """Actualiza el stock de un producto"""
        if producto not in self.grafo:
            print("Error: El producto no existe.")
            return
        
        if self.grafo.nodes[producto]['stock'] + cantidad < 0:
            print("Error: No puede quedar stock negativo.")
            return
        
        self.grafo.nodes[producto]['stock'] += cantidad
        print(f"Stock de '{producto}' actualizado. Nuevo stock: {self.grafo.nodes[producto]['stock']}")
    
    def productos_stock_bajo(self, umbral=30):
        """Muestra productos con stock bajo"""
        print(f"\nProductos con stock bajo (menos de {umbral} unidades):")
        bajo_stock = False
        for nodo in self.grafo.nodes():
            stock = self.grafo.nodes[nodo]['stock']
            if stock < umbral:
                print(f"- {nodo}: {stock} unidades")
                bajo_stock = True
        
        if not bajo_stock:
            print("No hay productos con stock bajo.")

def mostrar_menu():
    print("\n--- MENÚ PAPELERÍA CON GESTIÓN INTELIGENTE DE STOCK ---")
    print("1. Mostrar todos los productos")
    print("2. Mostrar relaciones entre productos")
    print("3. Obtener recomendaciones de productos")
    print("4. Agregar nuevo producto")
    print("5. Establecer relación entre productos")
    print("6. Actualizar stock de producto")
    print("7. Ver productos con stock bajo")
    print("8. Recomendaciones inteligentes de reposición")
    print("9. Visualizar grafo de relaciones")
    print("10. Salir")

def main():
    sistema = PapeleriaGrafo()
    
    while True:
        mostrar_menu()
        opcion = input("Seleccione una opción (1-10): ")
        
        if opcion == "1":
            sistema.mostrar_productos()
            
        elif opcion == "2":
            sistema.mostrar_relaciones()
            
        elif opcion == "3":
            producto = input("Ingrese el nombre del producto para obtener recomendaciones: ")
            recomendaciones = sistema.recomendar_productos(producto)
            if recomendaciones:
                print(f"\nProductos recomendados con '{producto}':")
                for i, rec in enumerate(recomendaciones, 1):
                    precio = sistema.grafo.nodes[rec]['precio']
                    stock = sistema.grafo.nodes[rec]['stock']
                    print(f"{i}. {rec} (${precio}, Stock: {stock})")
            else:
                print("\nNo se encontraron recomendaciones o el producto no existe.")
                
        elif opcion == "4":
            nombre = input("Nombre del nuevo producto: ")
            try:
                precio = float(input("Precio del producto: "))
                stock = int(input("Stock inicial: "))
                sistema.agregar_producto(nombre, precio, stock)
            except ValueError:
                print("Error: El precio y stock deben ser números válidos.")
                
        elif opcion == "5":
            producto1 = input("Primer producto: ")
            producto2 = input("Segundo producto: ")
            try:
                frecuencia = float(input("Frecuencia de relación (0-1): "))
                if 0 <= frecuencia <= 1:
                    sistema.agregar_relacion(producto1, producto2, frecuencia)
                else:
                    print("Error: La frecuencia debe estar entre 0 y 1.")
            except ValueError:
                print("Error: La frecuencia debe ser un número válido.")
                
        elif opcion == "6":
            producto = input("Nombre del producto: ")
            try:
                cantidad = int(input("Cantidad a añadir/restar (ej: 10 o -5): "))
                sistema.actualizar_stock(producto, cantidad)
            except ValueError:
                print("Error: La cantidad debe ser un número entero.")
        
        elif opcion == "7":
            try:
                umbral = int(input("Umbral de stock bajo (deje vacío para 30): ") or 30)
                sistema.productos_stock_bajo(umbral)
            except ValueError:
                print("Error: El umbral debe ser un número entero.")
                
        elif opcion == "8":
            try:
                umbral = int(input("Umbral de stock bajo (deje vacío para 30): ") or 30)
                recomendaciones = sistema.recomendar_reposicion_stock(umbral)
                
                if recomendaciones:
                    print("\nRecomendaciones de reposición basadas en relaciones:")
                    print("(Productos que deberías reponer primero por su relación con productos de bajo stock)")
                    
                    productos_bajo_stock = [nodo for nodo in sistema.grafo.nodes() 
                                          if sistema.grafo.nodes[nodo]['stock'] < umbral]
                    
                    print(f"\nProductos con stock bajo (<{umbral}): {', '.join(productos_bajo_stock)}")
                    
                    print("\nPrioridad de reposición:")
                    for i, (producto, score) in enumerate(recomendaciones, 1):
                        stock_actual = sistema.grafo.nodes[producto]['stock']
                        print(f"{i}. {producto} (Score: {score:.2f}, Stock actual: {stock_actual})")
                else:
                    print("\nNo hay recomendaciones de reposición en este momento.")
            except ValueError:
                print("Error: El umbral debe ser un número entero.")
                
        elif opcion == "9":
            print("Generando visualización del grafo...")
            sistema.visualizar_grafo()
            
        elif opcion == "10":
            print("Saliendo del sistema...")
            break
            
        else:
            print("Opción no válida. Por favor seleccione una opción del 1 al 10.")
        

if __name__ == "__main__":
    main()

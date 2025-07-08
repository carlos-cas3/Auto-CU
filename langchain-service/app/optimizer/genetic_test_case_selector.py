import random
import numpy as np
from deap import base, creator, tools, algorithms

def optimize_test_cases(test_cases, max_generations=40, population_size=50):
    if not test_cases:
        print("⚠️ No se recibieron casos de prueba para optimizar.")
        return []

    # Extraer todos los CU y RF únicos del conjunto total
    all_cu = set(tc["cu"] for tc in test_cases)
    all_rf = set(tc["rf"] for tc in test_cases)
    num_cases = len(test_cases)

    # Crear tipo fitness (si no ha sido creado ya)
    if not hasattr(creator, "FitnessMulti"):
        creator.create("FitnessMulti", base.Fitness, weights=(1.0, 1.0, -0.5))  # +cobertura, +similitud, -cantidad
    if not hasattr(creator, "Individual"):
        creator.create("Individual", list, fitness=creator.FitnessMulti)

    toolbox = base.Toolbox()
    toolbox.register("attr_bool", lambda: random.randint(0, 1))
    toolbox.register("individual", tools.initRepeat, creator.Individual, toolbox.attr_bool, n=num_cases)
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)

    def evaluate(individual):
        selected = [test_cases[i] for i, bit in enumerate(individual) if bit == 1]

        if not selected:
            return 0.0, 0.0, 0.0

        cu_covered = set(tc["cu"] for tc in selected)
        rf_covered = set(tc["rf"] for tc in selected)
        sim_avg = np.mean([tc["similarity"] for tc in selected])

        cu_score = len(cu_covered) / len(all_cu)
        rf_score = len(rf_covered) / len(all_rf)

        return cu_score + rf_score, sim_avg, len(selected)

    toolbox.register("evaluate", evaluate)
    toolbox.register("mate", tools.cxTwoPoint)
    toolbox.register("mutate", tools.mutFlipBit, indpb=0.05)
    toolbox.register("select", tools.selNSGA2)

    print(f"🔍 Casos de prueba iniciales: {num_cases}")
    print(f"📊 Total CU únicos: {len(all_cu)} | Total RF únicos: {len(all_rf)}")

    pop = toolbox.population(n=population_size)
    algorithms.eaSimple(pop, toolbox, cxpb=0.5, mutpb=0.2, ngen=max_generations, verbose=False)

    best = tools.selBest(pop, 1)[0]
    optimized = [test_cases[i] for i, bit in enumerate(best) if bit == 1]

    # Métricas finales
    final_cu = set(tc["cu"] for tc in optimized)
    final_rf = set(tc["rf"] for tc in optimized)
    final_sim = np.mean([tc["similarity"] for tc in optimized]) if optimized else 0.0

    print("✅ Optimización completada:")
    print(f"   🧪 Casos seleccionados: {len(optimized)}")
    print(f"   🎯 Cobertura CU: {len(final_cu)} / {len(all_cu)}")
    print(f"   🎯 Cobertura RF: {len(final_rf)} / {len(all_rf)}")
    print(f"   📈 Similitud promedio: {round(final_sim, 4)}")

    return optimized

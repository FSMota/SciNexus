"""
Módulo: recommender.py
Sistema de Recomendação para Pareamento de Artigos e Revisores
"""

def calcular_similaridade_jaccard(tags_artigo: list[str], tags_revisor: list[str]) -> float:
    """
    Calcula a Similaridade de Jaccard entre dois conjuntos de strings.
    Fórmula: |A ∩ B| / |A ∪ B|
    """
    set_artigo = set([tag.strip().lower() for tag in tags_artigo])
    set_revisor = set([tag.strip().lower() for tag in tags_revisor])
    
    # Se ambos estiverem vazios, não há similaridade
    if not set_artigo and not set_revisor:
        return 0.0
        
    intersecao = set_artigo.intersection(set_revisor)
    uniao = set_artigo.union(set_revisor)
    
    return len(intersecao) / len(uniao)


def recomendar_artigos(perfil_revisor_tags: list[str], lista_submissoes: list) -> list:
    """
    Recebe as áreas de domínio do revisor e a lista de submissões pendentes do evento.
    Retorna a lista ordenada do artigo mais recomendado (maior score) para o menos recomendado.
    """
    artigos_pontuados = []
    
    for submissao in lista_submissoes:
        score = calcular_similaridade_jaccard(submissao.palavras_chave, perfil_revisor_tags)
        
        artigos_pontuados.append({
            "submissao_id": submissao.id,
            "titulo": submissao.titulo,
            "relevance_score": round(score, 2),
            "match_perfeito": score == 1.0
        })
        
    # Ordena a lista de forma decrescente com base no relevance_score
    artigos_ordenados = sorted(artigos_pontuados, key=lambda x: x['relevance_score'], reverse=True)
    
    return artigos_ordenados
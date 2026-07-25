class QueryClassifier:

    STRUCTURAL_KEYWORDS = [
        "which",
        "list",
        "import",
        "imports",
        "show imports",
        "module",
        "modules",
        "class",
        "classes",
        "dependency",
        "dependencies",
        "api",
        "apis",
        "file",
        "files"
    ]

    FLOW_KEYWORDS = [
        "flow",
        "workflow",
        "trace",
        "path",
        "execution",
        "sequence",
        "route"
    ]

    SEMANTIC_KEYWORDS = [
        "explain",
        "summarize",
        "describe",
        "how",
        "why",
        "purpose",
        "overview"
    ]

    def contains_keyword(self, query, words, keyword):
        """
        Check whether a keyword exists in the query.

        - Single-word keywords are matched as complete words.
        - Multi-word keywords are matched as phrases.
        """
        if " " in keyword:
            return keyword in query

        return keyword in words

    def classify(self, query):
        """Classify the user query."""

        query = query.lower()
        words = query.split()

        # Semantic Queries
        for keyword in self.SEMANTIC_KEYWORDS:
            if self.contains_keyword(query, words, keyword):
                return {"type": "semantic"}

        # Flow Queries
        for keyword in self.FLOW_KEYWORDS:
            if self.contains_keyword(query, words, keyword):
                return {"type": "flow"}

        # Structural Queries
        for keyword in self.STRUCTURAL_KEYWORDS:
            if self.contains_keyword(query, words, keyword):
                return {"type": "structural"}

        # Default
        return {"type": "semantic"}


if __name__ == "__main__":

    classifier = QueryClassifier()

    while True:

        query = input("\nEnter your query (or 'exit'): ")

        if query.lower() == "exit":
            break

        result = classifier.classify(query)

        print(result)
class QueryClassifier:

    FLOW_KEYWORDS = [
        "flow",
        "workflow",
        "trace",
        "execution",
        "sequence",
        "call chain",
        "calls",
        "called by",
        "calling"
    ]

    DEPENDENCY_KEYWORDS = [
        "dependency",
        "dependencies",
        "depend",
        "depends",
        "imports",
        "import"
    ]

    ROUTE_KEYWORDS = [
        "route",
        "endpoint",
        "request"
    ]

    GRAPH_KEYWORDS = [
        "show",
        "display",
        "visualize",
        "visualise",
        "graph",
        "connected",
        "connection",
        "relationship",
        "relationships",
        "hierarchy"
    ]

    EXPLANATION_KEYWORDS = [
        "explain",
        "summarize",
        "summarise",
        "describe",
        "how",
        "why",
        "purpose",
        "overview",
        "what",
        "does"
    ]

    def contains_keyword(self, query, words, keyword):
        """
        Check whether a keyword exists in the query.

        Single-word keywords are matched as complete words.
        Multi-word keywords are matched as phrases.
        """

        if " " in keyword:
            return keyword in query

        return keyword in words

    def contains_any(self, query, words, keywords):
        """Check whether any keyword from a list exists in the query."""

        return any(
            self.contains_keyword(
                query,
                words,
                keyword
            )
            for keyword in keywords
        )

    def classify(self, query):
        """
        Classify a query into one of two execution types:

        LLM
            The query only requires a textual AI response.

        GRAPH_LLM
            The query requires graph interaction and
            a textual AI response.
        """

        query = query.lower().strip()
        words = query.split()

        # ---------------------------------
        # Determine graph intent
        # ---------------------------------

        if self.contains_any(
            query,
            words,
            self.FLOW_KEYWORDS
        ):
            return {
                "type": "GRAPH_LLM",
                "intent": "flow"
            }

        if self.contains_any(
            query,
            words,
            self.DEPENDENCY_KEYWORDS
        ):
            return {
                "type": "GRAPH_LLM",
                "intent": "dependencies"
            }

        if self.contains_any(
            query,
            words,
            self.ROUTE_KEYWORDS
        ):
            return {
                "type": "GRAPH_LLM",
                "intent": "route"
            }

        if self.contains_any(
            query,
            words,
            self.GRAPH_KEYWORDS
        ):
            return {
                "type": "GRAPH_LLM",
                "intent": "graph"
            }

        # ---------------------------------
        # Default to LLM
        # ---------------------------------

        return {
            "type": "LLM",
            "intent": "explanation"
        }


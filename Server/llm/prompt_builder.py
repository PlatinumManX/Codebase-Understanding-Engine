class PromptBuilder:

    SYSTEM_PROMPT = (
        "You are an expert software architect.\n"
        "Answer the user's question using ONLY the provided context.\n"
        "The provided context may include conversation history, graph context, "
        "and relevant code retrieved from the repository.\n"
        "Do not invent implementation details.\n"
        "If the provided context is insufficient, clearly state that more code "
        "or project information is required."
    )

    def build_prompt(
        self,
        question,
        retrieved_chunks,
        graph_context=None,
        conversation_history=None
    ):
        """
        Build a structured prompt for the LLM.

        Context provided to the LLM:
            Conversation History
            +
            Current Question
            +
            Graph Context
            +
            Retrieved Code
        """

        prompt = self.SYSTEM_PROMPT
        prompt += "\n\n"

        # ---------------------------------
        # Conversation History
        # ---------------------------------

        if conversation_history:
            prompt += "CONVERSATION HISTORY:\n"

            for message in conversation_history:

                role = message.get(
                    "role",
                    "user"
                ).upper()

                content = message.get(
                    "content",
                    ""
                ).strip()

                if content:
                    prompt += f"{role}: {content}\n"

        # ---------------------------------
        # Current Question
        # ---------------------------------

        prompt += "\nCURRENT QUESTION:\n"
        prompt += f"{question}\n"

        # ---------------------------------
        # Graph Context
        # ---------------------------------

        if graph_context:
            prompt += "\nGRAPH CONTEXT:\n"

            # ---------------------------------
            # Existing selected/highlighted context
            # ---------------------------------

            selected = graph_context.get(
                "selected"
            )

            highlighted = graph_context.get(
                "highlighted"
            )

            if selected:
                prompt += (
                    "SELECTED GRAPH ELEMENT:\n"
                )

                prompt += (
                    f"ID: {selected.get('id', 'unknown')}\n"
                )

                prompt += (
                    f"TYPE: {selected.get('type', 'unknown')}\n"
                )

                prompt += (
                    f"NAME: {selected.get('name', 'unknown')}\n"
                )

                if selected.get("file"):
                    prompt += (
                        f"FILE: {selected['file']}\n"
                    )

                if selected.get("path"):
                    prompt += (
                        f"PATH: {selected['path']}\n"
                    )

            if highlighted:
                prompt += (
                    "\nHIGHLIGHTED GRAPH ELEMENT:\n"
                )

                if isinstance(highlighted, list):
                    for element in highlighted:
                        prompt += (
                            f"{element}\n"
                        )
                else:
                    prompt += (
                        f"{highlighted}\n"
                    )

            # ---------------------------------
            # Graph operation context
            # ---------------------------------

            operation = graph_context.get(
                "operation"
            )

            target = graph_context.get(
                "target"
            )

            subgraph = graph_context.get(
                "subgraph"
            )

            if operation:
                prompt += (
                    "\nGRAPH OPERATION:\n"
                    f"{operation}\n"
                )

            if target:
                prompt += (
                    f"GRAPH TARGET:\n"
                    f"{target}\n"
                )

            if subgraph:
                nodes = list(
                    subgraph.nodes(data=True)
                )

                edges = list(
                    subgraph.edges(data=True)
                )

                prompt += "\nGRAPH NODES:\n"

                for node_id, data in nodes:
                    prompt += (
                        f"- {node_id} "
                        f"({data.get('type', 'unknown')})"
                    )

                    if data.get("name"):
                        prompt += (
                            f" name={data['name']}"
                        )

                    prompt += "\n"

                prompt += "\nGRAPH RELATIONSHIPS:\n"

                for source, target_node, data in edges:
                    prompt += (
                        f"- {source} "
                        f"--[{data.get('type', 'unknown')}]--> "
                        f"{target_node}\n"
                    )

        # ---------------------------------
        # Relevant Code
        # ---------------------------------

        prompt += "\nRELEVANT CODE:\n"

        if retrieved_chunks:

            for result in retrieved_chunks:

                chunk = result["chunk"]

                prompt += (
                    "\n------------------------------\n"
                )

                prompt += (
                    f"ID: {chunk['id']}\n"
                )

                prompt += (
                    f"TYPE: {chunk['type']}\n"
                )

                prompt += (
                    f"NAME: {chunk['name']}\n"
                )

                prompt += (
                    f"FILE: {chunk['file']}\n"
                )

                prompt += "\nCODE:\n"

                prompt += (
                    f"{chunk['code']}\n"
                )

        else:

            prompt += (
                "No relevant code was retrieved.\n"
            )

        # ---------------------------------
        # Instructions
        # ---------------------------------

        prompt += (
            "\nINSTRUCTIONS:\n"
            "- Answer the user's current question clearly.\n"
            "- Use previous conversation when relevant to the current question.\n"
            "- Treat the selected or highlighted graph element as important context.\n"
            "- Use retrieved repository code as the primary source for implementation details.\n"
            "- Use graph context to understand the relationship or location of the relevant code.\n"
            "- Use only the supplied repository context.\n"
            "- Do not assume or invent implementation details.\n"
            "- If the supplied context is insufficient, clearly say so.\n"
        )

        return prompt


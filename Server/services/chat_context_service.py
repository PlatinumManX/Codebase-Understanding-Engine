import uuid
from datetime import datetime, timezone

from services.metadata_service import MetadataService


class ChatContextService:
    """
    Manages conversation history for AI chat sessions.

    Conversations are stored separately from repository records.

    Structure:

        repository
            ↓
        conversation
            ↓
        messages[]
    """

    def __init__(self):
        self.metadata_service = MetadataService()

    @property
    def db(self):
        return self.metadata_service.db

    @property
    def collection(self):
        return self.db["conversations"]

    def create_conversation(self, repository_id):
        """
        Create a new conversation for a repository.

        Returns the generated conversation ID.
        """

        conversation_id = f"chat_{uuid.uuid4().hex}"

        now = datetime.now(timezone.utc)

        conversation = {
            "conversation_id": conversation_id,
            "repository_id": repository_id,
            "messages": [],
            "created_at": now,
            "updated_at": now
        }

        self.collection.insert_one(
            conversation
        )

        return conversation_id

    def get_conversation(
        self,
        conversation_id,
        repository_id
    ):
        """
        Retrieve a conversation belonging to a repository.

        Returns None if the conversation does not exist.
        """

        return self.collection.find_one(
            {
                "conversation_id": conversation_id,
                "repository_id": repository_id
            }
        )

    def get_messages(
        self,
        conversation_id,
        repository_id
    ):
        """
        Retrieve the message history for a conversation.
        """

        conversation = self.get_conversation(
            conversation_id,
            repository_id
        )

        if not conversation:
            return []

        return conversation.get(
            "messages",
            []
        )

    def add_message(
        self,
        conversation_id,
        repository_id,
        role,
        content
    ):
        """
        Add a message to an existing conversation.

        role should normally be:
            user
            assistant
        """

        message = {
            "role": role,
            "content": content,
            "timestamp": datetime.now(timezone.utc)
        }

        result = self.collection.update_one(
            {
                "conversation_id": conversation_id,
                "repository_id": repository_id
            },
            {
                "$push": {
                    "messages": message
                },
                "$set": {
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )

        return result.modified_count > 0

    def delete_conversation(
        self,
        conversation_id,
        repository_id
    ):
        """
        Delete a conversation belonging to a repository.
        """

        result = self.collection.delete_one(
            {
                "conversation_id": conversation_id,
                "repository_id": repository_id
            }
        )

        return result.deleted_count > 0

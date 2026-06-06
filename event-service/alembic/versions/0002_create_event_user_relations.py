"""create event user relations

Revision ID: 0002_create_event_user_relations
Revises: 0001_create_events_table
Create Date: 2026-05-28 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0002_create_event_user_relations"
down_revision: Union[str, Sequence[str], None] = "0001_create_events_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "event_user_relations",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("event_id", sa.Integer(), sa.ForeignKey("events.id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("role", sa.String(length=255), nullable=False),
        sa.Column("status", sa.String(length=255), nullable=False, server_default=sa.text("'ativo'")),
        sa.Column("approved_by_user_id", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("event_id", "user_id", "role", name="uq_event_user_role"),
    )
    op.create_index(op.f("ix_event_user_relations_id"), "event_user_relations", ["id"], unique=False)
    op.create_index(op.f("ix_event_user_relations_event_id"), "event_user_relations", ["event_id"], unique=False)
    op.create_index(op.f("ix_event_user_relations_user_id"), "event_user_relations", ["user_id"], unique=False)
    op.create_index(
        op.f("ix_event_user_relations_approved_by_user_id"),
        "event_user_relations",
        ["approved_by_user_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_event_user_relations_approved_by_user_id"), table_name="event_user_relations")
    op.drop_index(op.f("ix_event_user_relations_user_id"), table_name="event_user_relations")
    op.drop_index(op.f("ix_event_user_relations_event_id"), table_name="event_user_relations")
    op.drop_index(op.f("ix_event_user_relations_id"), table_name="event_user_relations")
    op.drop_table("event_user_relations")
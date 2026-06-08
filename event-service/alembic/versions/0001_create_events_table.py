"""create events table

Revision ID: 0001_create_events_table
Revises: 
Create Date: 2026-05-27 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0001_create_events_table"
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "events",
        sa.Column("id", sa.Integer(), primary_key=True, nullable=False),
        sa.Column("titulo", sa.String(), nullable=False),
        sa.Column("categoria", sa.String(length=255), nullable=False),
        sa.Column("data_inicio", sa.Date(), nullable=False),
        sa.Column("data_fim", sa.Date(), nullable=True),
        sa.Column("local", sa.String(), nullable=False),
        sa.Column("status", sa.String(length=255), nullable=False),
        sa.Column("numero_participantes", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("destaque", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("resumo", sa.Text(), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False, server_default=sa.text("'[]'")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index(op.f("ix_events_id"), "events", ["id"], unique=False)
    op.create_index(op.f("ix_events_titulo"), "events", ["titulo"], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_events_titulo"), table_name="events")
    op.drop_index(op.f("ix_events_id"), table_name="events")
    op.drop_table("events")
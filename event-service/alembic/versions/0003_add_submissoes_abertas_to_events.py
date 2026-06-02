"""add submissoes_abertas to events

Revision ID: 0003_add_submissoes_abertas_to_events
Revises: 0002_create_event_user_relations
Create Date: 2026-05-28 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "0003_submissoes_abertas_evt"
down_revision: Union[str, Sequence[str], None] = "0002_create_event_user_relations"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "events",
        sa.Column("submissoes_abertas", sa.Boolean(), nullable=False, server_default=sa.true()),
    )
    op.execute(sa.text("UPDATE events SET submissoes_abertas = true WHERE submissoes_abertas IS NULL"))
    op.alter_column("events", "submissoes_abertas", server_default=None)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("events", "submissoes_abertas")
"""Add image column to Tweets

Revision ID: 3c3ef7a36464
Revises: bc9678ca0029
Create Date: 2024-09-20 08:27:32.268034

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3c3ef7a36464'
down_revision = 'bc9678ca0029'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tweets', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image', sa.String(length=1000), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tweets', schema=None) as batch_op:
        batch_op.drop_column('image')

    # ### end Alembic commands ###

##########################################
# RDS Subnet Group
##########################################
resource "aws_db_subnet_group" "trippin" {
  name       = "${var.environment}-trippin-db-subnet"
  subnet_ids = aws_subnet.private[*].id

  tags = merge(local.common_tags, {
    Name = "${var.environment}-db-subnet"
  })
}

##########################################
# RDS Security Group
##########################################
resource "aws_security_group" "rds_sg" {
  name        = "${var.environment}-rds-sg"
  description = "Allow Postgres access from EKS node group"
  vpc_id      = aws_vpc.trippin.id

  ingress {
    description     = "Postgres from EKS nodes"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [data.aws_security_group.eks_nodes.id] # EKS 노드 SG에서 접근 허용
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = merge(local.common_tags, {
    Name = "${var.environment}-rds-sg"
  })
}

##########################################
# RDS Instance
##########################################
resource "aws_db_instance" "postgres" {
  identifier             = "${var.environment}-trippin-db"
  engine                 = "postgres"
  engine_version         = "17.6"
  instance_class         = var.rds_instance_class
  allocated_storage      = var.rds_allocated_storage

  db_subnet_group_name   = aws_db_subnet_group.trippin.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  db_name                   = var.db_name
  username               = var.db_username
  password               = var.db_password

  skip_final_snapshot    = true
  deletion_protection    = false

  tags = merge(local.common_tags, {
    Name = "${var.environment}-rds"
  })
}



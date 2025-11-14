##########################################
# OUTPUTS
##########################################

# output "vpc_id" {
#   description = "VPC ID for Trippin environment"
#   value       = aws_vpc.trippin.id
# }

output "public_subnet_ids" {
  description = "List of public subnet IDs"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "List of private subnet IDs"
  value       = aws_subnet.private[*].id
}

output "eks_cluster_name" {
  description = "EKS Cluster name"
  value       = var.eks_cluster_name
}


output "rds_endpoint" {
  description = "PostgreSQL RDS endpoint"
  value       = aws_db_instance.postgres.address
}

output "ecr_repository_url" {
  description = "ECR Repository URL"
  value       = aws_ecr_repository.trippin_backend.repository_url
}

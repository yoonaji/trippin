variable "aws_region" {
  type    = string
  default = "ap-northeast-2"
}

variable "aws_profile" {
  type    = string
  default = "" # "trippin" 등 프로필 사용 시 값 입력
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "vpc_cidr" {
  type    = string
  default = "10.10.0.0/16"
}

variable "public_subnets" {
  type    = list(string)
  default = ["10.10.1.0/24","10.10.2.0/24"]
}

variable "private_subnets" {
  type    = list(string)
  default = ["10.10.11.0/24","10.10.12.0/24"]
}

variable "eks_cluster_name" {
  type    = string
  default = "trippin-eks-cluster"
}

variable "node_instance_type" {
  type    = string
  default = "t3.small"
}

variable "desired_capacity" {
  type    = number
  default = 1
}

variable "max_capacity" {
  type    = number
  default = 2
}

variable "rds_allocated_storage" {
  type    = number
  default = 20
}

variable "rds_instance_class" {
  type    = string
  default = "db.t3.small"
}

variable "db_name" {
  type    = string
  default = "trippindb"
}

variable "db_username" {
  type    = string
  default = "trippin"
}

variable "db_password" {
  type      = string
  sensitive = true
  description = "DB password. DO NOT commit to git. Use terraform.tfvars or env TF_VAR_db_password"
}

variable "ecr_repo_name" {
  type    = string
  default = "trippin-backend"
}
variable "route53_zone_id" {
  description = "Route53 hosted zone ID for the domain"
  type        = string
}

variable "domain_name" {
  description = "Base domain name (e.g., example.com)"
  type        = string
}


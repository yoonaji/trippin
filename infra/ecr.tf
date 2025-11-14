resource "aws_ecr_repository" "trippin_backend" {
  name = var.ecr_repo_name

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = merge(local.common_tags, { Name = "${var.environment}-ecr" })
}

resource "aws_ecr_lifecycle_policy" "policy" {
  repository = aws_ecr_repository.trippin_backend.name

  policy = <<EOF
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Expire untagged images older than 7 days",
      "selection": {
        "tagStatus": "untagged",
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 7
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}

# ALB용 IAM Policy (EKS에서 Ingress Controller가 사용할 권한)
resource "aws_iam_policy" "alb_controller_policy" {
  name        = "AWSLoadBalancerControllerIAMPolicy"
  description = "Policy for AWS Load Balancer Controller to manage ALBs"
  policy      = file("${path.module}/alb_controller_policy.json")
}

# ALB Controller용 IAM Role
resource "aws_iam_role" "alb_controller_role" {
  name = "eks-alb-controller-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

# IAM Role에 Policy 연결
resource "aws_iam_role_policy_attachment" "alb_controller_attach" {
  policy_arn = aws_iam_policy.alb_controller_policy.arn
  role       = aws_iam_role.alb_controller_role.name
}

provider "helm" {
  kubernetes  = {
    config_path = "~/.kube/config"
  }
}
# EKS 클러스터에 ALB Controller 배포 (Helm으로)
resource "helm_release" "aws_load_balancer_controller" {
  name       = "aws-load-balancer-controller"
  repository = "https://aws.github.io/eks-charts"
  chart      = "aws-load-balancer-controller"
  namespace  = "kube-system"

  set = [{
    name  = "clusterName"
    value = var.eks_cluster_name
  }
    ,{
    name  = "serviceAccount.create"
    value = "false"
  }
    ,{
    name  = "serviceAccount.name"
    value = "aws-load-balancer-controller"
  }]

  depends_on = [
    var.eks_cluster_name,
    aws_iam_role_policy_attachment.alb_controller_attach
  ]
}

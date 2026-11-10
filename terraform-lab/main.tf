
terraform {
  required_providers {
    local = {
      source  = "hashicorp/local"
      version = "~> 2.5"
    }
  }
}

resource "local_file" "devops_note" {
  filename = "${path.module}/terraform-created.txt"
  content  = "Hello! This file was created using Terraform."
}

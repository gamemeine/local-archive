terraform {
  backend "gcs" {
    bucket = "tf-local-archive"
    prefix = "terraform/state"
  }
}
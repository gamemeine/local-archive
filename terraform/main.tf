terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "6.27.0"
    }
  }
}

provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone
}

resource "google_artifact_registry_repository" "default" {
  location      = var.region
  repository_id = "default"
  format        = "DOCKER"
}

resource "google_compute_instance" "default" {
  name         = "server"
  machine_type = "e2-standard-4"
  zone         = var.zone
  tags         = ["postgres"]

  boot_disk {
    initialize_params {
      image = "ubuntu-os-cloud/ubuntu-2204-lts"
    }
  }

  network_interface {
    // Uses the default VPC network.
    network = "default"
    access_config {}
  }
}
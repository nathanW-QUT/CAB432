terraform {
    required_providers {
        aws = {
            source = "hashicorp/aws"
            version = "5.69.0"
        }
    }
}

provider "aws" {
  region = "ap-southeast-2"
  access_key 
  secret_key 
  token = "IQoJb3JpZ2luX2VjEDsaDmFwLXNvdXRoZWFzdC0yIkYwRAIgNVEthI95BDqA6EV9JF9ScKV7MrOFpWsN3jNuLb2Hgj8CIGeXborEghi9xOKMmraLwjDrhwkEaTuwZKu3rbQjGCnGKq4DCIT//////////wEQAxoMOTAxNDQ0MjgwOTUzIgzbTDnOTEytag/HzqYqggNgOWZ7NQeEm64d7rHCYn4K2zBB2YmjoZfzTesFylCeXHzjBPvTxe7a3hltwIJQYmMqky7mYcAZR1HGs2/FhqML6/eV/y/blVgd536E5gXXh7FDzS+MqcS1R1ahWubDK0JhdoOU4DGc9Xa98o6yyraJvt+jRb1xmI+OASR+WA350YJI+VKGc97he1/L9c+lsxiqD5KyBBMGq5GbzW+RAsUNPYbhSJgNl/lLjCDddK1QZDZ3QBIouUKHOu/ZYZWGw8QOaYaN3nJXrPBcwFsxNfELqSW7w0aYyKbu41ES1KNlvsTFOphqlKPNyJehBj2QbH35fGTvBiYipFSpJQsyYr9OfZ3qAO1azif5sHIIndMoGinaYakYg2GVwI3/LT8uQOIYIdZ6KNVWYlkFbExktvfimWtdTTbw6nl61LTPqRWi2cK7x8TiG6iFqzUR2mqC1nc4YxEWqJYp57Ydc4epZjEwJwhL6QzXXryRPFXh9t2WtzJApvJuq/0S6TqXtJ0cpqW3BjCAy+23BjqnAWkV6xF6Qi1fkxHHG4ppUZ/vxboZTeae5XeiWeEu5+4JTRbAaFWu4R98pfI4LcQu9YTx3aEvfU94pDekouZcmRX+p8gkQvo3MvXzZQ1Yai59dnAgSLHoswGsq71SMdWCa8hQl/pCuxi6iH5d/NIANFUiywoduRtWfvhFNEnRLrxt6m/BM++KQyPeKknAUoWRvqcMnBAFUpH04fduG8YZ2rSV8xOKMqIN"
}

resource "aws_s3_bucket" "g40bucket2" {
  bucket = "g40bucket2"
  tags = {
    Name = "G40 Video Storage"
    qut-username = "n11270551@qut.edu.au"
    purpose = "testing"
  }
}
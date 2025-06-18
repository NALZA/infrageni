import { ExportFormat } from './formats';

export const EXPORT_EXAMPLES: Record<
  string,
  {
    description: string;
    sampleOutput: string;
    useCase: string;
  }
> = {
  'mermaid-c4': {
    description:
      'C4 Context diagrams show high-level architecture with clear boundaries and relationships',
    sampleOutput: `C4Context
    title Infrastructure Architecture
    
    Enterprise_Boundary(vpc1, "Main VPC", "VPC") {
        System_Boundary(subnet1, "Public Subnet", "SUBNET") {
            System(web1, "Web Server", "Compute (t3.micro)")
            SystemDb(db1, "Database", "Database (mysql)")
        }
    }
    
    %% Connections
    Rel(web1, db1, "Database Query")
    Rel(user1, web1, "HTTPS Request")
    
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")`,
    useCase:
      'Perfect for documentation, architecture reviews, and stakeholder presentations',
  },
  'mermaid-architecture': {
    description:
      'Architecture diagrams provide a technical view with grouped components and services',
    sampleOutput: `architecture-beta
    title Infrastructure Architecture
    
    group vpc1(vpc)[Main VPC]
    service web1(server)[Web Server]:vpc1
    service db1(database)[Database]:vpc1
    
    web1 --> db1
    user1 --|HTTPS| web1`,
    useCase: 'Ideal for technical documentation and system design discussions',
  },
  'mermaid-flowchart': {
    description:
      'Simple flowchart diagrams that work reliably across all Mermaid implementations',
    sampleOutput: `flowchart TD
    vpc1["Main VPC"]
    web1("Web Server")
    db1("Database")
    
    web1 --> db1
    vpc1 --> web1`,
    useCase: 'Best compatibility and simple, clear visualization',
  },
  json: {
    description:
      'Complete data export including all component properties and spatial relationships',
    sampleOutput: `{
  "items": [
    {
      "id": "vpc-123",
      "label": "Main VPC",
      "isBoundingBox": true,
      "properties": { "cidrBlock": "10.0.0.0/16" }
    }
  ],
  "connections": [
    {
      "id": "arrow-456",
      "from": "web-123",
      "to": "db-789",
      "label": "Database Query"
    }
  ],
  "metadata": {
    "exportedAt": "2024-01-15T10:30:00Z",
    "format": "json"
  }
}`,
    useCase:
      'Great for data integration, automation, and creating backups of your designs',
  },
  terraform: {
    description:
      'Basic Infrastructure as Code template for AWS resources (requires customization)',
    sampleOutput: `resource "aws_vpc" "main_vpc" {
  cidr_block = "10.0.0.0/16"
  
  tags = {
    Name = "Main VPC"
  }
}

resource "aws_instance" "web_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
}

# Note: Connections become security groups and routing rules`,
    useCase:
      'Starting point for Infrastructure as Code - customize for your specific needs',
  },
};

export function getFormatInfo(formatId: string): {
  format: ExportFormat | null;
  example: (typeof EXPORT_EXAMPLES)[string] | null;
} {
  const format = null; // Would need to import from formats
  const example = EXPORT_EXAMPLES[formatId] || null;

  return { format, example };
}

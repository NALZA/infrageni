# Export Functionality Guide

## Overview

The InfraGeni application now supports exporting your infrastructure diagrams to various formats including Mermaid C4 diagrams, JSON, and basic Terraform configurations.

## How to Use

1. **Create your infrastructure diagram** using the component library and canvas
2. **Click the "Export" button** in the toolbar at the top of the canvas
3. **Choose your export format** from the dropdown menu
4. **Preview the output** by clicking the "Preview" button
5. **Download the file** by clicking the "Download" button

## Supported Export Formats

### 1. Mermaid C4 Context

- **File extension:** `.mmd`
- **Description:** Creates a Mermaid C4 Context diagram that shows the high-level architecture
- **Best for:** Documentation, architectural overviews, presentations

### 2. Mermaid Architecture

- **File extension:** `.mmd`
- **Description:** Creates a Mermaid Architecture diagram with grouped components
- **Best for:** Technical documentation, system architecture diagrams

### 3. JSON

- **File extension:** `.json`
- **Description:** Raw canvas data in JSON format including all component properties and relationships
- **Best for:** Data export, integration with other tools, backup

### 4. Terraform (Basic)

- **File extension:** `.tf`
- **Description:** Basic Terraform configuration for AWS resources (experimental)
- **Best for:** Infrastructure as Code starting point (requires customization)

## Container/Bounding Box Support

The export functionality automatically detects container relationships:

- **VPC containers** are exported as Enterprise Boundaries in C4 diagrams
- **Subnet containers** are exported as System Boundaries
- **Availability Zone containers** are exported as regular Boundaries
- **Contained resources** are properly nested within their containers

## Example Outputs

### Mermaid C4 Context Example

```mermaid
C4Context
    title Infrastructure Architecture

    Enterprise_Boundary(vpc1, "Main VPC", "VPC") {
        note "10.0.0.0/16"
    }
    System_Boundary(subnet1, "Public Subnet", "SUBNET") {
        note "10.0.1.0/24"
    }

    System(compute1, "Web Server", "Compute (t3.micro)")
    SystemDb(database1, "Main Database", "Database (mysql)")

    UpdateRelStyle(compute1, database1, $offsetY="-10")
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```

### JSON Example

```json
{
  "items": [
    {
      "id": "vpc-123",
      "label": "Main VPC",
      "x": 100,
      "y": 100,
      "key": "vpc-vpc-123",
      "isBoundingBox": true,
      "properties": {
        "cidrBlock": "10.0.0.0/16"
      },
      "children": ["subnet-456", "compute-789"]
    }
  ],
  "connections": [],
  "metadata": {
    "exportedAt": "2024-01-15T10:30:00.000Z",
    "format": "json",
    "version": "1.0.0"
  }
}
```

## Tips and Best Practices

1. **Organize your diagram** with proper container hierarchies before exporting
2. **Use meaningful labels** for components as they appear in the exported diagrams
3. **Test the export** by previewing before downloading
4. **Customize Terraform outputs** as they are basic templates requiring modification
5. **Use Mermaid diagrams** for documentation and presentation purposes

## Troubleshooting

- **Empty export:** Ensure you have components on the canvas
- **Missing containers:** Make sure components are properly positioned within container boundaries
- **Malformed output:** Check component labels for special characters that might cause issues

## Future Enhancements

Planned improvements include:

- Connection/relationship export
- Additional diagram formats (PlantUML, Draw.io)
- More sophisticated Terraform generation
- Export templates and customization options

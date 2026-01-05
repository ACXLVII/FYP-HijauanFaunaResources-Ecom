#!/usr/bin/env python3
"""
Fix USDZ files for iOS Quick Look - Make materials double-sided
This fixes the "bald grass" issue where texture only shows from certain angles
"""

import zipfile
import os
import tempfile
import shutil
from pathlib import Path

def fix_usdz_file(usdz_path):
    """
    Fix a USDZ file to have double-sided materials for iOS Quick Look
    """
    print(f"\n🔧 Processing: {usdz_path}")
    
    # Create temporary directory
    temp_dir = tempfile.mkdtemp()
    
    try:
        # Extract USDZ (it's a ZIP file)
        with zipfile.ZipFile(usdz_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
        
        print(f"   Extracted to: {temp_dir}")
        
        # Find USD/USDA files
        usd_files = list(Path(temp_dir).rglob('*.usd*'))
        
        if not usd_files:
            print(f"   ❌ No USD files found inside USDZ")
            return False
        
        modified = False
        
        # Process each USD file
        for usd_file in usd_files:
            print(f"   📝 Modifying: {usd_file.name}")
            
            # Read the USD file
            with open(usd_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            original_content = content
            
            # Method 1: Add doubleSided = 1 to all Mesh definitions
            if 'def Mesh' in content and 'doubleSided' not in content:
                # Add doubleSided to each Mesh
                lines = content.split('\n')
                new_lines = []
                in_mesh = False
                mesh_indent = ""
                
                for line in lines:
                    new_lines.append(line)
                    
                    # Detect mesh definition
                    if 'def Mesh' in line:
                        in_mesh = True
                        # Get indentation
                        mesh_indent = line[:len(line) - len(line.lstrip())] + "    "
                    
                    # Add doubleSided right after mesh definition
                    elif in_mesh and '{' in line:
                        new_lines.append(f'{mesh_indent}uniform bool doubleSided = 1')
                        in_mesh = False
                
                content = '\n'.join(new_lines)
                modified = True
                print(f"      ✅ Added doubleSided to Mesh definitions")
            
            # Method 2: Add doubleSided to Material definitions
            if 'def Material' in content:
                lines = content.split('\n')
                new_lines = []
                in_material = False
                material_indent = ""
                already_has_double_sided = False
                
                for line in lines:
                    # Check if already has doubleSided in this material
                    if 'doubleSided' in line:
                        already_has_double_sided = True
                    
                    new_lines.append(line)
                    
                    # Detect material definition
                    if 'def Material' in line:
                        in_material = True
                        already_has_double_sided = False
                        material_indent = line[:len(line) - len(line.lstrip())] + "    "
                    
                    # Add doubleSided right after material definition
                    elif in_material and '{' in line and not already_has_double_sided:
                        new_lines.append(f'{material_indent}uniform bool doubleSided = 1')
                        in_material = False
                        modified = True
                
                content = '\n'.join(new_lines)
                if modified:
                    print(f"      ✅ Added doubleSided to Material definitions")
            
            # Method 3: Set shader doubleSided inputs
            if 'token outputs:surface.connect' in content or 'def Shader' in content:
                lines = content.split('\n')
                new_lines = []
                in_shader = False
                shader_indent = ""
                
                for line in lines:
                    new_lines.append(line)
                    
                    if 'def Shader' in line and 'UsdPreviewSurface' in line:
                        in_shader = True
                        shader_indent = line[:len(line) - len(line.lstrip())] + "    "
                    
                    elif in_shader and 'inputs:' in line and 'doubleSided' not in content:
                        # Add after first input
                        new_lines.append(f'{shader_indent}bool inputs:doubleSided = 1')
                        in_shader = False
                        modified = True
                
                content = '\n'.join(new_lines)
            
            # Write back if modified
            if content != original_content:
                with open(usd_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"      💾 File updated with double-sided rendering")
        
        if not modified:
            print(f"   ℹ️  File already appears to be double-sided or format not recognized")
            return False
        
        # Create backup of original
        backup_path = str(usdz_path).replace('.usdz', '_backup.usdz')
        shutil.copy2(usdz_path, backup_path)
        print(f"   💾 Backup created: {backup_path}")
        
        # Re-package as USDZ
        print(f"   📦 Re-packaging USDZ...")
        with zipfile.ZipFile(usdz_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(temp_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, temp_dir)
                    zipf.write(file_path, arcname)
        
        print(f"   ✅ Successfully fixed: {usdz_path}")
        return True
        
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False
        
    finally:
        # Cleanup temp directory
        shutil.rmtree(temp_dir, ignore_errors=True)


def main():
    """Fix all USDZ files in the models directory"""
    
    print("=" * 60)
    print("🌱 USDZ Double-Sided Texture Fix for iOS")
    print("=" * 60)
    print("\nThis script will fix the 'bald grass' issue on iOS Quick Look")
    print("by making all materials render as double-sided.\n")
    
    # Find all USDZ files
    models_dir = Path("public/models")
    usdz_files = list(models_dir.rglob("*.usdz"))
    
    if not usdz_files:
        print("❌ No USDZ files found in public/models/")
        return
    
    print(f"Found {len(usdz_files)} USDZ file(s):\n")
    for f in usdz_files:
        print(f"  - {f}")
    
    print("\n" + "=" * 60)
    proceed = input("\n⚠️  Proceed with fixing these files? (y/n): ")
    
    if proceed.lower() != 'y':
        print("❌ Cancelled by user")
        return
    
    # Process each file
    success_count = 0
    for usdz_file in usdz_files:
        if fix_usdz_file(str(usdz_file)):
            success_count += 1
    
    # Summary
    print("\n" + "=" * 60)
    print(f"✅ Successfully fixed: {success_count}/{len(usdz_files)} files")
    print("=" * 60)
    
    if success_count > 0:
        print("\n📱 Next steps:")
        print("1. Test on iOS device")
        print("2. Grass should now show texture from all angles")
        print("3. Backup files saved with '_backup.usdz' suffix")
        print("4. If issues persist, restore from backup")
    
    print("\n✨ Done!\n")


if __name__ == "__main__":
    main()


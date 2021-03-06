﻿using Cloudy.CMS.ContainerSpecificContentSupport.RepositorySupport;
using Cloudy.CMS.ContentSupport;
using Cloudy.CMS.ContentTypeSupport;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Cloudy.CMS.UI.ContentAppSupport.Controllers
{
    [Area("Cloudy.CMS")]
    [Route("Content")]
    public class SaveContentController : Controller
    {
        IContentTypeProvider ContentTypeProvider { get; }
        IContainerSpecificContentGetter ContainerSpecificContentGetter { get; }
        IContentTypeCoreInterfaceProvider ContentTypeCoreInterfaceProvider { get; }
        IPropertyDefinitionProvider PropertyDefinitionProvider { get; }
        IContainerSpecificContentUpdater ContainerSpecificContentUpdater { get; }
        IContainerSpecificContentCreator ContainerSpecificContentCreator { get; }
        PolymorphicFormConverter PolymorphicFormConverter { get; }

        public SaveContentController(IContentTypeProvider contentTypeProvider, IContainerSpecificContentGetter containerSpecificContentGetter, IContentTypeCoreInterfaceProvider contentTypeCoreInterfaceProvider, IPropertyDefinitionProvider propertyDefinitionProvider, IContainerSpecificContentUpdater containerSpecificContentUpdater, IContainerSpecificContentCreator containerSpecificContentCreator, PolymorphicFormConverter polymorphicFormConverter)
        {
            ContentTypeProvider = contentTypeProvider;
            ContainerSpecificContentGetter = containerSpecificContentGetter;
            ContentTypeCoreInterfaceProvider = contentTypeCoreInterfaceProvider;
            PropertyDefinitionProvider = propertyDefinitionProvider;
            ContainerSpecificContentUpdater = containerSpecificContentUpdater;
            ContainerSpecificContentCreator = containerSpecificContentCreator;
            PolymorphicFormConverter = polymorphicFormConverter;
        }

        [HttpPost]
        [Route("SaveContent")]
        public ContentResponseMessage SaveContent([FromBody] SaveContentRequestBody data)
        {
            if (!ModelState.IsValid)
            {
                return ContentResponseMessage.CreateFrom(ModelState);
            }

            var contentType = ContentTypeProvider.Get(data.ContentTypeId);

            var b = (IContent)JsonConvert.DeserializeObject(data.Content, contentType.Type, PolymorphicFormConverter);

            if (b.Id != null)
            {
                var a = (IContent)typeof(IContainerSpecificContentGetter).GetMethod(nameof(ContainerSpecificContentGetter.Get)).MakeGenericMethod(contentType.Type).Invoke(ContainerSpecificContentGetter, new[] { data.Id, null, contentType.Container });

                foreach(var coreInterface in ContentTypeCoreInterfaceProvider.GetFor(contentType.Id))
                {
                    foreach(var propertyDefinition in coreInterface.PropertyDefinitions)
                    {
                        var display = propertyDefinition.Attributes.OfType<DisplayAttribute>().FirstOrDefault();

                        if (display != null && display.GetAutoGenerateField() == false)
                        {
                            continue;
                        }

                        propertyDefinition.Setter(a, propertyDefinition.Getter(b));
                    }
                }

                foreach (var propertyDefinition in PropertyDefinitionProvider.GetFor(contentType.Id))
                {
                    var display = propertyDefinition.Attributes.OfType<DisplayAttribute>().FirstOrDefault();

                    if (display != null && display.GetAutoGenerateField() == false)
                    {
                        continue;
                    }

                    propertyDefinition.Setter(a, propertyDefinition.Getter(b));
                }

                ContainerSpecificContentUpdater.Update(a, contentType.Container);

                return new ContentResponseMessage(true, "Updated");
            }
            else
            {
                ContainerSpecificContentCreator.Create(b, contentType.Container);

                return new ContentResponseMessage(true, "Created");
            }
        }

        public class SaveContentRequestBody
        {
            public string Id { get; set; }
            [Required]
            public string ContentTypeId { get; set; }
            [Required]
            public string Content { get; set; }
        }
    }
}
